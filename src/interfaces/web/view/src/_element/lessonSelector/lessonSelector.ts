import Element from "./../element";
import lang, { ac } from "../../lib/language/language";
import LessonSelectorElement from "../_window/lessonSelectorElement/lessonSelectorElement";
import { Subject, Student } from "../../lib/unitData/unitData";
import { DataBase, DataArray } from "front-db";
import Button from "../_button/button";

export default class LessonSelector extends Element {
  private body: HTMLElement = ce("lesson-selector-body");
  private searchButton: Button = new Button();
  private searchContainer: HTMLElement = ce("search-container");
  private mainContainer: HTMLElement = ce("lesson-selector-main");

  private rdy: Promise<any>;
  private res: Function;
  constructor(subjects: DataArray<Subject[]>, cb: (selected: number) => void, toggleFinder: Function, initalActiveOption: number = 0) {
    super();

    this.rdy = new Promise((res) => {
      this.res = res;
    });

    (async () => {
      let width = 100 / await subjects.length();

      await subjects.forEach(async (subject, i) => {
        let elem = new LessonSelectorElement();

        subject.get("teacher", (teacher) => {
          elem.title = teacher;
        })
        elem.openCallback = () => {
          cb(i);
          this.activateOption(i);
        }

        elem.css("width", width + "%");
        await lang([["subject", await subject.get("name"), ".1"]], (name) => {
          elem.text = ac(name);
        })
        subject.get("color", (color) => {
          elem.activeColor = color;
        })

        this.body.apd(elem);

        this.res();
      })

      this.mainContainer.apd(this.body, this.searchContainer
        .apd(ce("search-img-container")
          .apd(ce("search-img"))
        )
        .apd(this.searchButton)
      );

      this.sra(this.mainContainer);

    })();


    this.activateOption(initalActiveOption);



    this.searchButton.addActivationCallback(toggleFinder);


    let students = [];
    subjects.forEach((subject: DataBase<Subject>) => {
      subject.ref("students").asArray.forEach((stud: DataBase<Student>) => {
        let student: any = {};
        subject.get("name", (subject) => {
          student.subject = subject;
        });
        subject.get("teacher", (teacher) => {
          student.teacher = teacher;
        });
        subject.get("color", (color) => {
          student.color = color;
        });
        stud.get("name", (name) => {
          student.name = name;
        });
        stud.get("klasse", (klasse) => {
          student.klasse = klasse;
        });
        students.push(student)
      })
    })
  }

  public async setSearchMode(mode: boolean) {
    if (mode) {
      await Promise.all([
        this.searchContainer.anim({marginLeft: 40}, {duration: 300}),
        this.body.anim({width: "100%"})
      ]);
    }
    else {
      await Promise.all([
        this.searchContainer.anim({marginLeft: 0}, {duration: 300}),
        this.body.anim({width: "calc(100% - 40px)"})
      ]);
    }
  }

  public focusActive() {
    this.body.childs().ea((e) => {
      if (e.active) {
        return e.focus();
      }
    })
  }

  public async activateOption(optionIndex: number) {
    await this.rdy;

    const elems = this.body.childs<LessonSelectorElement>();
    elems.ea((e: LessonSelectorElement) => {
        if (e !== elems[optionIndex]) e.active = false;
    });
    elems[optionIndex].active = true;
  }

  stl() {
    return require('./lessonSelector.css').toString();
  }

  public dark(): string {
    return require('./lessonSelector.dark.css').toString();
  }
  public light(): string {
    return require('./lessonSelector.light.css').toString();
  }

}

window.customElements.define('c-lesson-selector', LessonSelector);
