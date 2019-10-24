import * as fs from "fs";
import * as path from "path";
import validateData from "./validateData"
import main from "./../../index";
import inquirer from "./inquirer";
require("xrray")(Array)


 



let invalidConfig: boolean | string = false
let conf: any;
try {
  conf = JSON.parse(fs.readFileSync(path.join(__dirname, "./../../../resources/config.json")).toString())
}
catch(e) {
  invalidConfig = "parse"
}

let errors = validateData(conf)
if (!errors.empty) invalidConfig = "schema"


if (invalidConfig) {
  let log = "Unable to fetch config from \"resources/config.json\". "
  if (invalidConfig === "parse") log += "An error occured while parsing the json.\n\n"
  else if (invalidConfig === "schema") {
    log += "The schema is not valid. The following error"
    if (errors.length > 1) log += "s have"
    else log += " has"
    log += " been found:\n\n"

    errors.ea((e) => {
      log += "\t" + e.stack.substr(9) + "\n"
    })

    log += "\n"
  }

  log += "Continuing with inquiry.\n"

  console.log(log);


  inquirer().then((conf) => {
    console.log("main", JSON.stringify(conf, null, "  "))
  })
}






// conf = JSON.parse().toString());
// main(conf)

  