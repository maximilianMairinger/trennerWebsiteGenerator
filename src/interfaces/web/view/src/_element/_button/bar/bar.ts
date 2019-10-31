import Button from "./../button";

import { Lesson, selectLesson, Unit} from "../../../lib/weekData/weekData";
import { DataBase } from "front-db";
import lang from "../../../lib/language/language";

export default class Bar extends Button {
  private valueElem: HTMLElement;
  public containerElem: HTMLElement;
  public axisDescription: HTMLElement;
  private students: number;
  private maxStudents: number;

  private _enabled: boolean;
  private _disabled: boolean = false;

  constructor(unit: DataBase<Unit>, lesson: DataBase<Lesson>, public addStudentCallback?: Function, selected: boolean = false, enabled = true) {
    super((e) => {
      if (!this._enabled || this.disabled) return;
      if (this.addStudentCallback !== undefined) this.addStudentCallback();
    });

    this.containerElem = dc("bar-container");
    this.valueElem = dc("bar-value");
    this.axisDescription = dc("axis-description");

    this.containerElem.append(this.valueElem);
    this.sra(this.containerElem, this.axisDescription);

    unit.get("visible", (visible: boolean) => {
      this.disabled = !visible;
    });

    lesson.get("color", (color) => {
      this.valueElem.css("background-color", color);
    });

    lesson.get("maxStudents", (maxStudents) => {
      this.maxStudents = maxStudents;
    });

    (async () => {
      lang([["subject", await lesson.get("subject"), "1"]], (subject) => {
        this.axisDescription.html = subject.toUpperCase();
      })
    })();


    //Dont animate horizontally initialy (fade in instead)
    (async () => {
      this.setStudents(await lesson.current("currentStudents"));
      this.valueElem.css({height: (await lesson.current("currentStudents") / this.maxStudents) * 100 + "%"});
      this.valueElem.anim({opacity: 1}, {duration: 200});
    })();
    //Otherwise animate horizontally
    lesson.get("currentStudents", (currentStudents) => {
      this.studentCount = currentStudents;
    });

    if (selected) this.select();
    this.enabled = enabled;
  }

  private set disabled(to: boolean) {
    this._disabled = to;
    if (to) {
      this.css("opacity", .3);
      this.css("cursor", "default");
    } else {
      this.css("opacity", 1);
      this.css("cursor", "pointer");
    }
  }

  private get disabled() {
    return this._disabled;
  }

  public set enabled(to: boolean) {
    this._enabled = to;
  }

  public get enabled() {
    return this._enabled;
  }

  public enable() {
    this.enabled = true;
  }

  public disable() {
    this.enabled = false;
  }

  public get studentCount() {
    return this.students;
  }

  public select() {
    this.containerElem.addClass("selected");
  }

  public unselect() {
    this.containerElem.removeClass("selected");
  }

  public set studentCount(to: number) {
    if (this.students === to) return;
    this.setStudents(to);
    this.valueElem.anim({height: (to / this.maxStudents) * 100 + "%"}, {
      duration: 200,
      easing: "cubic-bezier(.6,.31,.42,1.02)"
    });
  }

  private setStudents(to: number) {
    this.students = to;
  }

  stl() {
    return super.stl() + require('./bar.css').toString();
  }

  public dark(): string {
    return super.dark() + require('./bar.dark.css').toString();
  }

  public light(): string {
    return super.light() + require('./bar.light.css').toString();
  }
}

window.customElements.define('c-bar', Bar);
