import Element from "./../element";
import { Subject, Student } from "../../lib/unitData/unitData";
import { DataBase, DataArray } from "front-db";
import StudentSearchAutoComplete from "../studentSearchAutoComplete/studentSearchAutoComplete";
import lang from "../../lib/language/language";
import CommingSoonIndecator from "../_indecator/commingSoonIndecator/commingSoonIndecator";


export default class FinderBar extends Element {
  private searchBar: HTMLInputElement = ce("input");
  private autoComplete: StudentSearchAutoComplete;

  constructor(subjects: DataArray<Subject[]>, closeCb: Function) {
    super();

    this.searchBar.spellcheck = false;
    this.searchBar.autocomplete = "off";
    this.searchBar.tabIndex = -1;

    lang("search_students", (text) => {
      this.searchBar.placeholder = text
    });

    (async () => {
      // let students = [];
      // subjects.forEach((subject: DataBase<Subject>) => {
      //   subject.ref("students").asArray.forEach((stud: DataBase<Student>) => {
      //     let student: any = {};
      //     student.subject = subject.get("name");
      //     subject.get("teacher", (teacher) => {
      //       student.teacher = teacher;
      //     });
      //     subject.get("color", (color) => {
      //       student.color = color;
      //     });
      //     stud.get("name", (name) => {
      //       student.name = name;
      //     });
      //     stud.get("klasse", (klasse) => {
      //       student.klasse = klasse;
      //     });
      //     students.push(student)
      //   })
      // })

      
      
      // this.searchBar.on("keyup", () => {
      //   this.autoComplete.query(this.searchBar.value)
      // });


      this.on("keydown", (e) => {
        if (e.code === "Escape") {
          closeCb();
        }
      });

      


      // this.autoComplete = new StudentSearchAutoComplete(students);

      // this.sra(this.searchBar, this.autoComplete);
      this.sra(this.searchBar, new CommingSoonIndecator());
    })();
  }

  public setSearch(query: string) {
    this.searchBar.value = query;
    //this.autoComplete.query(query);
  }

  public focus() {
    this.searchBar.focus();
  }

  public activateBar() {
    this.searchBar.tabIndex = 0;
  }
  public deactivateBar() {
    this.setSearch("");
    this.searchBar.tabIndex = -1;
  }

  stl() {
    return require('./finderBar.css').toString();
  }

  public dark(): string {
    return require('./finderBar.dark.css').toString();
  }
  public light(): string {
    return require('./finderBar.light.css').toString();
  }

}

window.customElements.define('c-finder-bar', FinderBar);
