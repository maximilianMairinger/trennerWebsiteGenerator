import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import ask from "./ask";
import schoolYear from "./schoolyear";
require("xrray")(Array)
const ncp = require('ncp').ncp
ncp.limit = 16;

let year = schoolYear()


ask().then((options) => {
  let showOptions = JSON.parse(JSON.stringify(options))
  showOptions.password = "[hidden]"
  showOptions.schoolYear = year
  console.log("Executing with the following options.\n" + JSON.stringify(showOptions, null, 2) + "\n");


  console.log("Creating output enviroment...");
  if (!fs.existsSync("./output")) fs.mkdirSync("./output")
  else {
    rimraf.sync('./output/*');
  }
  
  
  
  console.log("Cloning source...");
  ncp("./source", "./output", function (err) {
    if (err) return console.error(err);
    
    let index = cheerio.load(fs.readFileSync("./output/index.html"))
    
    
  });
})

