import Panel from "./../panel";
import BarChart from "./../../../_window/barChart/barChart";
import { getWeek, Unit, Day, weekDays, getAllDayNames } from "./../../../../lib/weekData/weekData";
import CardWrapper from "../../../cardWrapper/cardWrapper";
import { DataBase, DataArray } from "front-db";
import DayOption from "../../../_button/_rippleButton/_optionElement/dayOption/dayOption";

export default class DayInsightPanel extends Panel {
  protected domainName = "insight";

  private mainContainer = ce("chart-wrapper");
  private barChart: BarChart;
  private windowContainer = new CardWrapper();
  private periodSelector = ce("period-selector");

  private nextDayIndex: number;

  private _dayIndex: number;
  constructor(dayIndex?: number) {
    super();
    this.barChart = new BarChart(undefined, (hide, withoutAnimation) => {
      
      let styles = {height: (hide) ? "calc(100% - 40px)" : "50%"}
      if (withoutAnimation) this.windowContainer.css(styles)
      else this.windowContainer.anim(styles)
      this.windowContainer.fullScreen(hide, withoutAnimation)
    });

    //this.sra(this.headContainer);
    this.mainContainer.apd(this.barChart);
    this.sra(this.mainContainer, this.windowContainer, this.periodSelector);

    if (dayIndex !== undefined) this.dayIndex = dayIndex;
  }
  public set dayIndex(to: number) {
    this.nextDayIndex = to;

    (async () => {
      if (this.nextDayIndex !== to) return;
      this._dayIndex = to;
      let day: DataArray<Day> = (await getWeek()).ref(to).asArray;
      // The case when there is no such day as this.day (e.g when a class has on monday no lernbüro)
      if (day === undefined) {
        console.warn("No day for \"" + to + "\" found.");
        return;
      }

      getAllDayNames().then((dayNames) => {
        this.domainName = dayNames.val[to]
      });

      let period_width = 100 / day.length();
      let dayOptions: DayOption[] = [];

      day.forEach((unit: DataBase<Unit>) => {
        let dayOption = new DayOption(unit.ref("period"), () => {
          this.unit = unit;
          dayOption.activate();
          dayOptions.ea((o) => {
            if (o !== dayOption) o.deactivate();
          })
        });

        dayOption.css("width", period_width + "%");
        this.periodSelector.apd(dayOption);
        dayOptions.add(dayOption);
      })



      //Init
      this.unit = day.ref("0");
      dayOptions[0].activate();
    })();
  }
  public get dayIndex(): number {
    return this._dayIndex;
  }
  private set unit(unit: DataBase<Unit>) {
    this.windowContainer.setUnit(unit);
    this.barChart.setUnit(unit);
  }
  protected activationCallback(active: boolean) {
    super.activationCallback(active)
    this.barChart.vate(active)
  }
  stl() {
    return super.stl() + require('./dayInsightPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./dayInsightPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./dayInsightPanel.light.css').toString();
  }

}

window.customElements.define('c-day-insight-panel', DayInsightPanel);
