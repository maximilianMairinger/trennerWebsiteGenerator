import Manager from "./../manager";
import Panel from "./../../_panel/panel"
import lazyLoad, { ImportanceMap, Import } from "./../../../../lib/lazyLoad/lazyLoad";
import { getUnit, LB } from "../../../../lib/unitData/unitData";
import { DataBase } from "front-db";
import delay from "../../../../lib/delay/delay";

export default class TeacherPanelManager extends Manager {
  protected currentFrame: Panel;
  private _currentPanelName: string | "langauge" | "theme" | "sign_out" | "feedback";
  private impMap: ImportanceMap<() => Promise<any>>;
  private loadImpMap: Function;

  private map: Map<string, Promise<any>>;
  private fullMap: Promise<Map<string, Promise<any>>>;
  private resFullMap: Function;
  constructor(switchToPanel: (panel: string) => any, blurCallback?: Function) {
    super(blurCallback);

    this.impMap = new ImportanceMap<() => Promise<any>>(
      {key: new Import<string>("language", 2, (LangPanel) => {
        return new LangPanel();
      }), val: () => import(/* webpackChunkName: "biOptionPanel" */"./../../_panel/_biOptionPanel/languageSelectPanel/languageSelectPanel")},

      {key: new Import<string>("theme", 2, (LangPanel) => {
        return new LangPanel();
      }), val: () => import(/* webpackChunkName: "biOptionPanel" */"./../../_panel/_biOptionPanel/themeSelectPanel/themeSelectPanel")},

      {key: new Import<string>("feedback", 2, (FeedbackPanel) => {
        return new FeedbackPanel(() => {
          let ok = false;

          (async () => {
            switchToPanel(await (await getUnit()).current("0.name"));
            ok = true;
          })();

          //When not loaded within 1 ms switch to nolbs page

          delay(1).then(() => {
            if (!ok) {
              ok = true;
              switchToPanel("noLBS");
            }
          })
        });
      }), val: () => import(/* webpackChunkName: "feedbackPanel" */"./../../_panel/_windowPanel/feedbackPanel/feedbackPanel")},

      {key: new Import<string>(undefined, 1, (Page) => {

      }), val: () => import(/* webpackChunkName: "viewStudentsPanel" */"./../../_panel/viewStudentsPanel/viewStudentsPanel")},


      {key: new Import<string>("noLBS", 1, (Page) => {
        return new Page();
      }), val: () => import(/* webpackChunkName: "noLBSPanel" */"./../../_panel/_windowPanel/noLBSPanel/noLBSPanel")},
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

    (async () => {
      this.parseDomain(0, (await getUnit()).current("0.name"), switchToPanel)
    })();
  }
  public async setPanel(to: string | "langauge" | "theme" | "sign_out" | "feedback") {
    this._currentPanelName = to;
    //currentMap does have the panels not dependent on data (theme signout overview usw) at the preload stage; and later every panel.
    let mayBeAlreadyThePanel = this.map.get(to);
    if (mayBeAlreadyThePanel !== undefined) this.swapFrame(await mayBeAlreadyThePanel);
    //FullMap does savely have all panels added
    else this.swapFrame(await (await this.fullMap).get(to));
  }
  public getPanel(): string | "langauge" | "theme" | "sign_out" | "feedback" {
    return this._currentPanelName
  }
  protected async activationCallback(active: boolean) {
    super.activationCallback(active);

    if (active) {
      (await getUnit()).forEach((lb: DataBase<LB>) => {
        lb.get("name", (name: string) => {
          this.impMap.set(new Import<string>(name, 1, (ViewStudentPanel) => {
            return new ViewStudentPanel(lb);
          }), () => import(/* webpackChunkName: "viewStudentsPanel" */"./../../_panel/viewStudentsPanel/viewStudentsPanel"));
        })
      });


      this.resFullMap(await this.loadImpMap());
    }
  }
  stl() {
    return super.stl() + require('./teacherPanelManager.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./teacherPanelManager.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./teacherPanelManager.light.css').toString();
  }
}

window.customElements.define('c-teacher-panel-manager', TeacherPanelManager);
