import Element from "./../element";
import StudentCard from "../_studentCard/interactAbleStudentCard/interactAbleStudentCard";
import { Data } from "front-db";
import * as Fuse from "fuse.js";



interface Student {
  name: string;
  klasse: string;
  subject: Data<string>;
  teacher: string;
  color: string;
}

let options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  includeMatches: true,
  keys: [
    {
      name: 'teacher',
      weight: 0.5
    },
    {
      name: 'subject',
      weight: 0.7
    },
    {
      name: 'klasse',
      weight: 0.9
    },
    {
      name: 'name',
      weight: 1
    }
  ]
};


export default class StudentSearchAutoComplete extends Element {
  //@ts-ignore
  private fuse: Fuse<Student, {}>;


  private container = ce("card-container");
  private students: Student[];
  private allStudents: Student[];
  constructor(students: Student[]) {
    super();
    this.students = cloneData(students)
    this.allStudents = cloneData(students)

    this.tabIndex = -1;
    this.fuse = new Fuse(this.students, options);

    let body = ce("card-wrapper");

    body.apd(this.container);


    this.sra(body);
  }

  query(query: string) {
    this.container.emptyNodes();




    let exactlyMatchingStudents = this.allStudents.filter((student) => {
      if (student.name === query || student.klasse === query || student.subject.val === query || student.teacher === query) return true;
    })


    if (exactlyMatchingStudents.length !== 0) this.students.set(exactlyMatchingStudents);
    else this.students.set(this.allStudents);

    this.fuse.search(query).ea(({item, matches}) => {
      let card = new StudentCard("drag", item.subject);

      card.set(item.name, item.klasse, item.color)

      matches.ea((match) => {
        if (match.key === "name" || match.key === "klasse") card.highlight(match.key, match.indices);
      })


      this.container.apd(card);
    })
  }

  public async close() {
    await this.anim({opacity: 0, transform: "translateY(-50%)"}, {duration: 100});
    this.hide();
  }
  public async open() {
    this.show();
    await this.anim({opacity: 1, transform: "translateY(0)"}, {duration: 100});
  }

  stl() {
    return require('./studentSearchAutoComplete.css').toString();
  }
  public dark(): string {
    return require('./studentSearchAutoComplete.dark.css').toString();
  }
  public light(): string {
    return require('./studentSearchAutoComplete.light.css').toString();
  }

}

window.customElements.define('c-student-search-auto-complete', StudentSearchAutoComplete);
