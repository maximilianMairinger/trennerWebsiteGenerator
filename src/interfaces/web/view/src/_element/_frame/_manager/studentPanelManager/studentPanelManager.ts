import Manager from "./../manager";
import Panel from "./../../_panel/panel"
import {getAllDayNames} from "./../../../../lib/weekData/weekData";
import lazyLoad, { ImportanceMap, Import } from "./../../../../lib/lazyLoad/lazyLoad";
import {setLang} from "./../../../../lib/language/language";
import { switchToTheme } from "../../../element";

export default class StudentPanelManager extends Manager {
  protected currentFrame: Panel;
  private _currentPanelName: "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "sign_out" | "feedback";
  private impMap: ImportanceMap<() => Promise<any>>;
  private loadImpMap: Function;

  private map: Map<string, Promise<any>>;
  private fullMap: Promise<Map<string, Promise<any>>>;
  private resFullMap: Function;
  constructor(switchToPanel: (panel: "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday") => any, blurCallback?: Function, initPanelName?: "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "sign_out" | "feedback") {
    super(blurCallback);

    this.impMap = new ImportanceMap<() => Promise<any>>(
      {key: new Import<string>("overview", 1, (Overview) => {
        return new Overview();
      }), val: () => import(/* webpackChunkName: "overviewPanel" */"./../../_panel/overviewPanel/overviewPanel")},
      {key: new Import<string>("language", 3, (LangPanel) => {
        return new LangPanel();
      }), val: () => import(/* webpackChunkName: "biOptionPanel" */"./../../_panel/_biOptionPanel/languageSelectPanel/languageSelectPanel")},

      {key: new Import<string>("theme", 3, (LangPanel) => {
        return new LangPanel();
      }), val: () => import(/* webpackChunkName: "biOptionPanel" */"./../../_panel/_biOptionPanel/themeSelectPanel/themeSelectPanel")},

      {key: new Import<string>("feedback", 3, (FeedbackPanel) => {
        return new FeedbackPanel(() => {
          switchToPanel("overview");
        });
      }), val: () => import(/* webpackChunkName: "feedbackPanel" */"./../../_panel/_windowPanel/feedbackPanel/feedbackPanel")},


      {key: new Import<string>(undefined, 2, () => {
        //This is just pre loaded here (so that it isnt a bottleneck in the activation callback)
      }), val: () => import(/* webpackChunkName: "dayInsightPanel" */"./../../_panel/dayInsightPanel/dayInsightPanel")},
    );



    this.loadImpMap = lazyLoad(this.impMap, (panel) => {
      this.body.apd(panel);
    });

    // We are loading here since the above panels can be loaded reguardless of the weekData
    // feedbackPanel is just beeing chached here
    this.map = this.loadImpMap();

    this.fullMap = new Promise((res) => {
      this.resFullMap = res;
    });

    if (initPanelName !== undefined) this.setPanel(initPanelName);
  }
  public async setPanel(to: "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "sign_out" | "feedback") {

    this._currentPanelName = to;
    //currentMap does have the panels not dependent on data (theme signout overview usw) at the preload stage; and later every panel.
    let mayBeAlreadyThePanel = this.map.get(to);
    if (mayBeAlreadyThePanel !== undefined) this.swapFrame(await mayBeAlreadyThePanel);
    //FullMap does savely have all panels added
    else this.swapFrame(await (await this.fullMap).get(to));
  }
  public getPanel(): "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "sign_out" | "feedback" {
    return this._currentPanelName;
  }
  protected async activationCallback(active: boolean) {
    super.activationCallback(active);

    if (active) {
      (await getAllDayNames()).subscribe((dayNames) => {
        dayNames.ea((day, i) => {
          this.impMap.set(new Import<string>(day, 2, (dayInsightPanel) => {
            return new dayInsightPanel(i);
          }), () => import(/* webpackChunkName: "dayInsightPanel" */"./../../_panel/dayInsightPanel/dayInsightPanel"));
        });
      });
      

      (async () => {
        this.resFullMap(await this.loadImpMap());
      })();


      (await this.map.get("overview")).fetchData();
    }
  }
  stl() {
    return super.stl() + require('./studentPanelManager.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./studentPanelManager.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./studentPanelManager.light.css').toString();
  }
}

window.customElements.define('c-student-panel-manager', StudentPanelManager);
