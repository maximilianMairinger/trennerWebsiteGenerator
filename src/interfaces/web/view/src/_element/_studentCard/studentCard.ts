import Element from "./../element";
import delay from "../../lib/delay/delay";
import { Data } from "front-db";

const options = {duration: 100};

export interface Indeces extends Array<Array<number>> {

}

const openHighlight = "<card-highlight>";
const closeHighlight = "</card-highlight>";

function removeHighlights(text: string) {
  return text.replace(openHighlight, "").replace(closeHighlight, "")
}

export default class StudentCard extends Element {
  private cardDotElem = ce("card-dot");
  private studentNameElem = ce("student-name");
  private studentClassElem = ce("student-class");
  public body = ce("card-body");

  private containerRight = ce("r-container");
  private containerLeft = ce("l-container");

  private _color: string;
  private _klasse: string;
  private _name: string;
  constructor(name?: string, klasse?: string, color?: string) {
    super(true, false);

    this.containerLeft.apd(this.cardDotElem);
    this.containerRight.apd(this.studentNameElem, this.studentClassElem);
    this.body.apd(this.containerLeft, this.containerRight);
    this.sra(this.body);


    if (name !== undefined) this.name = name;
    if (klasse !== undefined) this.klasse = klasse;
    if (color !== undefined) this.color = color;
  }

  public highlight(what: "name" | "klasse", indeces: Indeces) {
    let matchesIndex = 0;
    let pair = indeces[matchesIndex];
    if (pair === undefined) return;
    let text: string = this[what];
    let res = "";
    for (let i = 0; i < text.length; i++) {
      if (pair[0] === i) res += openHighlight;
      res += text[i];
      if (pair[1] === i) {
        res += closeHighlight;
        matchesIndex++;
        pair = indeces[matchesIndex];
        if (pair === undefined) {
          res += text.substring(i+1)
          this[what] = res;
          return;
        }
      }
    }
  }
  public clearHightlight() {
    this.name = this.name;
    this.klasse = this.klasse;
  }
  public set name(to: string) {
    let justText = removeHighlights(to);
    this._name = justText;
    this.studentNameElem.html = to;
    this.title = justText;
  }
  public async setName(to: string) {
    this._name = to;
    this.title = to;
    await this.studentNameElem.anim({opacity: 0}, options)
    this.studentNameElem.html = to;
    await this.studentNameElem.anim({opacity: 1}, options)
  }
  public get name(): string {
    return this._name === undefined ? "" : this._name;
  }
  public set klasse(to: string) {
    this._klasse = removeHighlights(to);
    this.studentClassElem.html = to;
  }
  public async setKlasse(to: string) {
    this._klasse = to;
    await this.studentClassElem.anim({opacity: 0}, options)
    this.studentClassElem.html = to;
    await this.studentClassElem.anim({opacity: 1}, options)
  }
  public get klasse(): string {
    return this._klasse === undefined ? "" : this._klasse
  }
  public set color(to: string) {
    this.setColorWithoutAnim(to)
  }

  private colorObservable: Data<string>;
  public setColorWithoutAnim(to: string | Data<string>) {
    if ((to === this.colorObservable && to.val === this.color) || to === this.color) return;
    if (this.colorObservable !== undefined) this.colorObservable.unsubscribe(null);
    if (typeof to === "string") {
      this._color = to;
      this.cardDotElem.css({backgroundColor: to});
    }
    else {
      this.setColorWithoutAnim(to.val)
      this.colorObservable = to;
      this.colorObservable.subscribe(this.setColorWithoutAnim.bind(this))
    }
  }
  public async setColor(to: string | Data<string>) {
    if ((to === this.colorObservable && to.val === this.color) || to === this.color) return;
    if (this.colorObservable !== undefined) this.colorObservable.unsubscribe(null);
    if (typeof to === "string") {
      this._color = to;
      this.cardDotElem.css({transition: "background-color 200ms"})
      this.cardDotElem.css({backgroundColor: to})
      await delay(200);
      this.cardDotElem.css({transition: ""})
    }
    else {
      this.setColor(to.val);
      this.colorObservable = to;
      this.colorObservable.subscribe(this.setColor.bind(this))
    }
  }
  public get color(): string {
    return this._color;
  }
  public set(name: string, klasse: string, color: string) {
    this.name = name;
    this.klasse = klasse;
    this.color = color;
  }

  stl() {
    return require('./studentCard.css').toString();
  }

  public dark(): string {
    return require('./studentCard.dark.css').toString();
  }
  public light(): string {
    return require('./studentCard.light.css').toString();
  }
}

window.customElements.define('c-student-card', StudentCard);
