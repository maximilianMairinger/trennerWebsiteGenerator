import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import * as inquirer from "inquirer";
require("xrray")(Array)
const ncp = require('ncp').ncp
ncp.limit = 16;


inquirer.prompt([
  {name: "username"},
  {name: "password", type: "password"},
]).then((options) => {
  console.log(options);
  



  console.log("Creating output enviroment.");
  if (!fs.existsSync("./output")) fs.mkdirSync("./output")
  else {
    rimraf.sync('./output/*');
  }
  
  
  
  console.log("Cloning source.");
  ncp("./source", "./output", function (err) {
    if (err) return console.error(err);
  
    
  });
})

