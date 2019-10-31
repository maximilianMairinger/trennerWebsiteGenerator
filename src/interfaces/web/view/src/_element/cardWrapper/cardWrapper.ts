import Element from "./../element";
import CardWindow from "../_window/cardWindow/cardWindow";
import { DataBase } from "front-db";
import { Unit, Lesson } from "../../lib/weekData/weekData";

export default class CardWrapper extends Element {

  private container: HTMLElement;
  private _unit: DataBase<Unit>;

  constructor(unit?: DataBase<Unit>) {
    super();
    this.container = ce("card-wrapper-container");
    this.sra(this.container);
    if (unit !== undefined) this.setUnit(unit);
  }

  public async setUnit(unit: DataBase<Unit>) {
    if(unit.equals(this._unit)) return;
    this._unit = unit
    this.container.emptyNodes();

    let lessons = unit.ref("lessons").asArray;

    lessons.forEach((lesson: DataBase<Lesson>) => {

      this.container.apd(ce("card-margin").apd(new CardWindow(unit, lesson)));
    })
  }

  public fullScreen(full: boolean, withoutAnimtion: boolean) {
    let styles = {height: full ? "25%" : "50%"};
    let elems = this.container.childs()
    if (withoutAnimtion) elems.css(styles)
    else elems.anim(styles)
  }

  stl() {
    return require('./cardWrapper.css').toString();
  }

  public dark(): string {
    return require('./cardWrapper.dark.css').toString();
  }
  public light(): string {
    return require('./cardWrapper.light.css').toString();
  }
}

window.customElements.define('c-card-wrapper', CardWrapper);
