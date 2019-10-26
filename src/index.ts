import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import * as write from "write"
import * as text2png from "text2png"
import schoolYear from "./schoolyear";
import selectorMap from "./selectorMap"
import upload from "./upload"

require("xrray")(Array)
const ncp = require('ncp').ncp
ncp.limit = 16;

let year = schoolYear()



export default (options, updateCallback?: (update: string, kind?: string) => void) => {
  return new Promise((res) => {
    if (updateCallback === undefined) updateCallback = console.log

    updateCallback("Creating output enviroment...");
    if (!fs.existsSync("./resources/output")) fs.mkdirSync("./resources/output")
    else {
      rimraf.sync('./resources/output/*');
    }
  
  
  
    updateCallback("Cloning source...");
    ncp("./resources/source", "./resources/output", function (err) {
      if (err) return updateCallback("Unknown error.", "error");
      rimraf('./resources/output/01TREE', async () => {
        if (err) return updateCallback("Unknown error.", "error");
  
        updateCallback("Parsing Home...");
  
  
        let $ = cheerio.load(fs.readFileSync("./resources/output/index.html"))
        $(selectorMap.yearHead).html("Schuljahr " + year)
        $(selectorMap.vornameHead).html("Arbeit von " + options.name + " " + options.year + "xHIT")
  
  
        $(selectorMap.title).html(options.name + ": Home")
  
  
  
        fs.writeFileSync('./resources/output/imgLayout/footer02.png', text2png(options.name + " ::: Wexstraße 19-23 ::: 1200 Wien ::: " + options.username + "(at)student.tgm.ac.at", {color: "black"}));
  
        $(selectorMap.footerImg).attr("src", "imgLayout/footer02.png");
  
  
        let semester = options.year * 2
  
        let title = $(selectorMap.mainArticle)
        title = title.children("h1")
  
        $(title[0]).html("Kompetenzen des " + (semester - 1) + ". Semesters")
        $(title[1]).html("Kompetenzen des " + (semester) + ". Semesters")
  
  
        let topNavElems = $(selectorMap.topNav).children()
        let sideNavElems = $(selectorMap.sideNav).children()
  
        fs.readFile("./resources/source/01TREE/01smart.html", async (err, buff) => {
          if (err) return updateCallback("Unknown error.", "error");
  
          for (let i = 0; i < 3; i++) {
            let teacher = options.teachers[i]
            let teacherName = teacher.name
            let comps = teacher.competencies
  
            $(topNavElems[i + 1]).html("Prof. " + teacherName).attr("href", teacherName + "/" + comps.first + ".html")
            $(sideNavElems[i]).html("Prof. " + teacherName).attr("href", teacherName + "/" + comps.first + ".html")
  
            updateCallback("Parsing " + teacherName + "...");
  
  
  
            comps.ea((comp) => {
              write("./resources/output/" + teacherName + "/" + comp + ".html", createSubpage(
                teacher,
                options.teachers,
                comp,
                cheerio.load(buff),
                options
              )
              .html());
            })
          }
  
  
  
          write("./resources/output/index.html", $.html())
  
          await upload("test", options)
  

          res()
        })
      })
  
  
    });
  })
}

type teacher = {name: string, competencies: string[]}

function createSubpage(teacher: teacher, teachers: {0: teacher, 1: teacher, 2: teacher}, competence: string, $: CheerioStatic, options: any): CheerioStatic {
  $(selectorMap.yearHead).html("Schuljahr " + year)
  $(selectorMap.vornameHead).html("Arbeit von " + options.name + " " + options.year + "xHIT")

  $(selectorMap.title).html(options.name + ": " + teacher.name + ": " + competence)

  $(selectorMap.footerImg).attr("src", "../imgLayout/footer02.png");


  $($(selectorMap.mainArticle).children()[0]).html(competence)

  let sideNav = $(selectorMap.sideNav)
  let navElem = $(sideNav.children()[0]).clone()
  sideNav.empty();


  let topNavElems = $(selectorMap.topNav).children()

  teacher.competencies.ea((comp) => {
    sideNav.append(navElem.clone().html(comp).attr("href", comp + ".html"))
  })
  
  

  for (let i = 0; i < 3; i++) {
    let teacherName = teachers[i].name
    $(topNavElems[i+1]).html("Prof. " + teacherName).attr("href", "../" + teacherName + "/" + teachers[i].competencies.first + ".html")
  }






  return $
}
