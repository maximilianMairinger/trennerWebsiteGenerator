import Window from "./../window";
import Button from "../../_button/button";

export default class LessonSelectorElement extends Window {
  private body: HTMLElement = ce("lesson-selector-element-body");
  private textElem: HTMLElement = ce("text-elem");
  private btn: Button;
  constructor(public activeColor: string = "transparent", text: string = "", public openCallback?: Function) {
    super("left", "transparent", 2);


    this.btn = new Button();

    this.btn.on("focus", () => {
      if (this.openCallback !== undefined) this.openCallback();
    });

    this.sra(this.body.apd(this.textElem, this.btn));


    this.on("dragover", () => {
      if (this.openCallback !== undefined) this.openCallback();
    })



    this.text = text;
  }

  public set text(to: string) {
    this.textElem.html = to;
  }
  public get text() {
    return this.textElem.html;
  }

  private isActive: boolean;
  public get active() {
    return this.isActive;
  }
  public set active(to: boolean) {
    this.isActive = to;
    if (to) {
      this.color = this.activeColor;
      this.body.addClass("active");
    }
    else {
      this.color = "transparent";
      this.body.removeClass("active");
    }
  }

  public focus() {
    this.btn.focus();
  }

  stl() {
    return require('./lessonSelectorElement.css').toString();
  }

  public dark(): string {
    return require('./lessonSelectorElement.dark.css').toString();
  }
  public light(): string {
    return require('./lessonSelectorElement.light.css').toString();
  }

}

window.customElements.define('c-lesson-selector-element', LessonSelectorElement);
