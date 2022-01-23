require("dotenv").config()
const fs = require('fs')
const hljs = require('highlight.js')

const mdRender = require('markdown-it')({
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(str, { language: lang }).value
			} catch (__) {}
		}
		return ''
	}
})

function trimNewlines(text){
	const lines = text.split("\n").reverse()
	while (lines.length && lines[0] === "") { lines.shift() }
	lines.reverse()
	while (lines.length && lines[0] === "") { lines.shift() }
	return lines.join("\n")
}

function parseCardsFile(rawFileData){

	const lines = rawFileData.split("\n")
	var line, question, answer
	const cards = []

	// Discard lines til h1 found (category)
	do {line = lines.shift()}
	while (line !== undefined && line.slice(0,2) !== "# ")
	if (line === undefined) return []
	const category = line.slice(2)

	do {
		// Discard lines til h2 found (question)
		do {line = lines.shift()}
		while (line !== undefined && line.slice(0,3) !== "## ")
		question = line ? mdRender.render(line.slice(3)) : ""

		// Save all lines til next h2 found (answer)
		answer = []
		while (lines.length && lines[0].slice(0,3) !== "## "){
			answer.push(lines.shift())
		}
		answer = mdRender.render(trimNewlines(answer.join("\n")))

		if(question && answer) cards.push({category, question, answer})
		
	} while (line !== undefined)

	return cards
}

const cardPath = process.env.CARDS_PATH
const cardFolder = fs.readdirSync(cardPath).map(fn=>`${cardPath}/${fn}`)
const cardList = []
cardFolder.forEach(fileName=>{
	fileContents = fs.readFileSync(fileName, {encoding: "UTF-8"})
	cardList.push(...parseCardsFile(fileContents))
})

console.log(`[card parser] ${cardList.length} cards found`)

module.exports = cardList