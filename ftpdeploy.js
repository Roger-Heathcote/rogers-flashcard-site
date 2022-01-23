require('dotenv').config()
const { deploy } = require("@samkirkland/ftp-deploy")

async function deployMyCode() {
  console.log("🚚 Deploy started");
  await deploy({
    server: process.env.FTP_HOST,
    username: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
	"local-dir": "./build/"
  });
  console.log("🚀 Deploy done!");
}

deployMyCode();