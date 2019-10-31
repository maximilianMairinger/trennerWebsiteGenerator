import Window from "./../window";
import { DataBase } from "front-db";
import { Lesson, Unit, selectLesson } from "../../../lib/weekData/weekData";

import Button from "../../_button/button";
import lang from "../../../lib/language/language";


export default class CardWindow extends Window {

  private teacherText: HTMLElement;
  private teacherStats: HTMLElement;
  private roomStats: HTMLElement

  private container: HTMLElement;
  private btn: Button;

  private activationCallbacks: Function[] = [];
  private _disabled: boolean = false;

  constructor(unit: DataBase<Unit>, lesson: DataBase<Lesson>, activationCallback?: Function) {
    super("left", "gray", 10, false);
    this.btn = new Button(() => {
      if (this.disabled) return;
      selectLesson(unit, lesson);
      this.activationCallbacks.ea((f) => {
        f()
      });
    });
    if (activationCallback !== undefined) this.addActicatinCallback(activationCallback);
    this.container = ce("mobile-view-container");
    this.teacherText = ce("teacher-text");
    this.teacherStats = ce("teacher-stats");
    this.roomStats = ce("room-stats")

    unit.get("visible", (visible: boolean) => {
      this.disabled = !visible;
    });

    lesson.get("teacher", (teacher) => {
      this.teacherText.html = teacher;
      this.title = teacher
    });

    lesson.get("color", (color) => {
      this.color = color;
    });

    lesson.get("selected", (selected) => {
      if (selected) this.container.addClass("selected");
      else this.container.removeClass("selected")
    });

    (async () => {
      lesson.get(["currentStudents", "maxStudents", (await lang([["subject", lesson.get("subject"), "0"]]))[0]], (currentStudents, maxStudents, subject) => {
        this.teacherStats.html = currentStudents + "/" + maxStudents + " " + subject
      });
    })();

    lesson.get("room", (room) => {
      this.roomStats.html = room
    })



    this.container.apd(this.teacherText, this.teacherStats, this.roomStats)
    this.sra(this.container, this.btn);
  }

  public addActicatinCallback(f: Function) {
    this.activationCallbacks.add(f);
  }

  public removeActicatinCallback(f: Function) {
    this.activationCallbacks.remove(f);
  }

  private set disabled(to: boolean) {
    this._disabled = to;
    if (to) {
      this.css("opacity", .3);
      this.btn.css("cursor","default");
    } else {
      this.css("opacity", 1);
      this.btn.css("cursor","pointer");
    }
  }

  private get disabled() {
    return this._disabled;
  }

  stl() {
    return super.stl() + require('./cardWindow.css').toString();
  }

  public dark(): string {
    return super.dark() + require('./cardWindow.dark.css').toString();
  }

  public light(): string {
    return super.light() + require('./cardWindow.light.css').toString();
  }

}

window.customElements.define('c-card-window', CardWindow);
