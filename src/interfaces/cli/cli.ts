import * as fs from "fs";
import * as path from "path";
import validateData from "./validateData"
import main from "./../../index";
import inquirer from "./inquirer";
require("xrray").default(Array);


 


(async () => {
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
  
  
    conf = await inquirer()
  }
  else {
    console.log("Taking config from \"" + path.join(__dirname, "./../../../resources/config.json") + "\"")
  }

  

  for (let i = 0; i < 3; i++) {
    conf.teachers[i].competencies.ea((comp) => {
      if (comp.includes(" ")) console.warn("Warning: Do not use spaces in competencie names (as trenner usually runs this website through a w3c validator, which errors at spaces in urls).")
    })
  }

  let showOptions = JSON.parse(JSON.stringify(conf))
  if (showOptions.password) showOptions.password = "[hidden]"
  console.log("Executing with the following options.\n" + JSON.stringify(showOptions, null, 2) + "\n");
  
  await main(conf)
  console.log("Done. The generated website can be found in " + path.join(__dirname, "..", "..", "..", "resources", "output"));
  
})()
