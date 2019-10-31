import Window from "./../window";
import {Lesson, selectLesson, Unit} from "./../../../lib/weekData/weekData";
import Bar from "./../../_button/bar/bar";
import {DataBase} from "front-db";


export default class BarChart extends Window {
  private contentElem: HTMLElement;
  private axisElem: HTMLElement;

  private _unit: DataBase<Unit>;
  private active: boolean = false

  constructor(unit: DataBase<Unit>, private hideGraphCb: (hide: boolean, withoutAnimtion: boolean) => void) {
    super();

    this.contentElem = dc("bar-chart-content");
    this.axisElem = dc("bar-chart-axis");

    this.sra(this.axisElem, this.contentElem);

    if (unit !== undefined) this.setUnit(unit);
  }

  public async setUnit(unit: DataBase<Unit>) {
    if (this._unit === unit) return;
    this._unit = unit;
    

    let lessons = unit.ref("lessons").asArray;
    lessons.forEach((lesson: DataBase<Lesson>) => {
      let bar = new Bar(unit, lesson, () => {
        this.contentElem.childs().ea((e: Bar) => {
          if (bar !== e) e.unselect();
        });
        bar.select();

        unit.get("visible", (visible: boolean) => {
          bar.enabled = visible;
        });

        selectLesson(unit, lesson);
      });
      this.contentElem.apd(bar);

      lesson.get("selected", (s: boolean) => {
        if (s) bar.select();
        else bar.unselect();
      })
    }, () => {
      this.contentElem.emptyNodes();
      this.axisElem.emptyNodes();
    }, () => {
      this.firstBar = this.contentElem.childs<Bar>().first
      requestAnimationFrame(() => {
        if (this.active) this.stuffChanged()
      })
    });
  }
  public vate(active: boolean) {
    this.active = active
    this.updateGraphPosition(true)
    if (active) {
      this.on("resize", this.resizeListener)
    }
    else {
      this.off("resize", this.resizeListener)
    }
  }
  private resizeListener() {
    if (this.active) {
      this.updateGraphPosition()
    }
  }
  private stuffChanged() {
    if (this.firstBar !== undefined) {
      this.updateGraphPosition(true)
    }
  }
  private firstBar: Bar
  public updateGraphPosition(withoutAnimation: boolean = false) {
    //                            margin
    let hide = this.firstBar.offsetLeft < 30
    this.hideGraphCb(hide, withoutAnimation)
    this.hideGraph(hide, withoutAnimation);
  }
  public hideGraph(hide: boolean, withoutAnimation: boolean) {
    if (hide) {
      if (withoutAnimation) this.css({opacity: 0})
      else this.anim({opacity: 0})
    }
    else {
      if (withoutAnimation) this.css({opacity: 1})
      else this.anim({opacity: 1})
    }
  }
  public get unit() {
    return this._unit;
  }
  stl() {
    return super.stl() + require('./barChart.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./barChart.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./barChart.light.css').toString();
  }

}

window.customElements.define('c-bar-chart', BarChart);
