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


export default (options) => {
  let showOptions = JSON.parse(JSON.stringify(options))
  if (showOptions.password) showOptions.password = "[hidden]"
  showOptions.schoolYear = year
  console.log("Executing with the following options.\n" + JSON.stringify(showOptions, null, 2) + "\n");


  console.log("Creating output enviroment...");
  if (!fs.existsSync("./output")) fs.mkdirSync("./output")
  else {
    rimraf.sync('./output/*');
  }



  console.log("Cloning source...");
  ncp("./source", "./output", function (err) {

    rimraf('./output/01TREE', async () => {
      if (err) return console.error(err);

      console.log("Parsing Home...");


      let $ = cheerio.load(fs.readFileSync("./output/index.html"))
      $(selectorMap.yearHead).html("Schuljahr " + year)
      $(selectorMap.vornameHead).html("Arbeit von " + options.name + " " + options.year + "xHIT")


      $(selectorMap.title).html(options.name + ": Home")



      fs.writeFileSync('./output/imgLayout/footer02.png', text2png(options.name + " ::: Wexstraße 19-23 ::: 1200 Wien ::: " + options.username + "(at)student.tgm.ac.at", {color: "black"}));

      $(selectorMap.footerImg).attr("src", "imgLayout/footer02.png");


      let semester = options.year * 2

      let title = $(selectorMap.mainArticle)
      title = title.children("h1")

      $(title[0]).html("Kompetenzen des " + (semester - 1) + ". Semesters")
      $(title[1]).html("Kompetenzen des " + (semester) + ". Semesters")


      let topNavElems = $(selectorMap.topNav).children()
      let sideNavElems = $(selectorMap.sideNav).children()

      fs.readFile("./source/01TREE/01smart.html", async (err, buff) => {
        if (err) return console.log(err);



        let i = 0
        for (let teacher in options.teachers) {
          let comps = options.teachers[teacher]

          $(topNavElems[i + 1]).html("Prof. " + teacher).attr("href", teacher + "/" + comps.first + ".html")
          $(sideNavElems[i]).html("Prof. " + teacher).attr("href", teacher + "/" + comps.first + ".html")

          console.log("Parsing " + teacher + "...");



          comps.ea((comp) => {
            write("./output/" + teacher + "/" + comp + ".html", createSubpage(
              teacher,
              options.teachers,
              comp,
              cheerio.load(buff),
              options
            )
            .html());
          })

          i++;
        }



        write("./output/index.html", $.html())

        await upload("test", options)

        console.log("Done. The generated website can be found in " + path.join(__dirname, "..", "output"));


      })
    })


  });

}

function createSubpage(teacher: string, teachers: {[teacher: string]: string[]}, competence: string, $: CheerioStatic, options: any): CheerioStatic {
  $(selectorMap.yearHead).html("Schuljahr " + year)
  $(selectorMap.vornameHead).html("Arbeit von " + options.name + " " + options.year + "xHIT")

  $(selectorMap.title).html(options.name + ": " + teacher + ": " + competence)

  $(selectorMap.footerImg).attr("src", "../imgLayout/footer02.png");


  $($(selectorMap.mainArticle).children()[0]).html(competence)

  let sideNav = $(selectorMap.sideNav)
  let navElem = $(sideNav.children()[0]).clone()
  sideNav.empty();

  let competences = teachers[teacher]
  competences.ea((comp) => {
    sideNav.append(navElem.clone().html(comp).attr("href", comp + ".html"))
  })




  let topNavElems = $(selectorMap.topNav).children()

  let i = 1
  for (let teacher in options.teachers) {
    $(topNavElems[i]).html("Prof. " + teacher).attr("href", "../" + teacher + "/" + options.teachers[teacher].first + ".html")

    i++;
  }





  return $
}
