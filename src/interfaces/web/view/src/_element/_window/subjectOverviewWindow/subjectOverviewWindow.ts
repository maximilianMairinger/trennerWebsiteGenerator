import lang, {fc, sc} from "./../../../lib/language/language";
import Window from "./../window";
import Editable from "./../../editable/editable";
import Selector from "./../../selector/selector";
import SelElem from "./../../_button/selectorElement/selectorElement";
import { DataBase, DataArray } from "front-db";
import { Lesson, Unit, getDayNamefromPeriod, Period, selectLesson, setNote } from "./../../../lib/weekData/weekData";
import { identifyForGrid } from "../../_frame/_panel/overviewPanel/overviewPanel";


export function dateToH_MinFormat(date: Date) {
  return date.toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute:'2-digit'
  });
}

export default class SubjectOverviewWindow extends Window {
  private subjectElem: HTMLElement;
  private noteElem: Editable;
  private titleElem: HTMLElement;

  private sel: Selector;
  constructor(unit: DataBase<Unit>, public onSubmit?: Function) {
    super("left");

    this.titleElem = dc("card-title");

    this.subjectElem = dc("card-subject");

    this.noteElem = new Editable("");

    this.sel = new Selector("right", "mouse");

    unit.get("visible", (visible: boolean) => {
      if (!visible) {
        this.sel.disable();
        this.css("opacity", .3);
        //this.noteElem.disable();
      }
      else {
        this.sel.enable();
        this.css("opacity", 1);
        //this.noteElem.enable();
      }
    })

    let selectorElements: SelElem[] = [];
    (async () => {
      let lessons: DataArray<Lesson[]> = (unit.ref("lessons")).asArray;
      await lessons.forEach(async (lesson: DataBase<Lesson>, i: string | number) => {
        selectorElements[i] = new SelElem("...", async () => {
          this.grayedOut = true;
          await selectLesson(unit, lesson);
          this.grayedOut = false;
        });

        await lang([["subject", lesson.get("subject"), ".0"]], (subject: string) => {
          selectorElements[i].text = subject;
        }, 10);
      });
      this.sel.elements = selectorElements;
    })();

    this.sra(this.titleElem, this.subjectElem, this.noteElem, this.sel);



    //Default values
    this.color = "black";

    //Real values
    (async () => {
      let lessons = (unit.ref("lessons")).asArray;
      lessons.forEach(async (ue: DataBase<Lesson>, i) => {


        ue.get(["color", "selected"], (color, selected) => {
          if (selected) this.color =  color;
        });

        this.css("grid-area", identifyForGrid(ue));

        let period = unit.ref<Period>("period");


        this.titleElem.inner = "   "
        getDayNamefromPeriod(period, async (weekDay) => {
          //debugger
          period.get([await lang(weekDay), "begin", "end"], (weekDay, begin: string, end: string) => {
            this.titleElem.html = fc(weekDay) + " " + dateToH_MinFormat(new Date(begin)) + " - " + dateToH_MinFormat(new Date(end));
          });
        })



        unit.get(["note", await lang("note")], (userNote, wordNote) => {
          if (userNote === "") {
            this.noteElem.value = fc(wordNote);
          }
          else {
            this.noteElem.value = userNote
          }
        })


        ue.get(["selected", (await lang([["subject", ue.get("subject"), 0]]))[0], await lang("subject.subject.0"), "room"], async (selected, subject, subjectDefault, room) => {
          if (selected) this.subjectElem.html = subject + " " + room;
          else if (i === (lessons.length())-1 && this.subjectElem.html === "") {
            this.subjectElem.html = fc(subjectDefault);
          }
        })


        this.noteElem.onSubmit = (s) => {
          setNote(unit, s);
          if (this.onSubmit !== undefined) this.onSubmit();
        }

      })

      this.on("contextmenu", (e) => {
        e.preventDefault();
      });
      this.on("mousedown", (e) => {
        if (e.which === 3) {
          this.sel.open(e)
          //When not prevennting default focus gets all messed up.
          e.preventDefault();
        };
      });
    })();
  }
  public set color(to: string) {
    super.color = to;
  }
  public set note(to: string) {
    this.noteElem.value = to;
  }
  public get note():string {
    return this.noteElem.value;
  }
  stl() {
    return super.stl() + require('./subjectOverviewWindow.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./subjectOverviewWindow.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./subjectOverviewWindow.light.css').toString();
  }
}
window.customElements.define('c-subject-overview', SubjectOverviewWindow);
