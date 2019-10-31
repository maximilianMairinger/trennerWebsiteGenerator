import PanelPage from "./../panelPage";
import {getAllDayNames} from "./../../../../../lib/weekData/weekData";
import PageOptionsElement from "../../../../_button/_rippleButton/_optionElement/pageOptionElement/pageOptionElement";
import lang, { fc } from "../../../../../lib/language/language";
import StudentPanelManager from "../../../_manager/studentPanelManager/studentPanelManager";


export default class StudentPage extends PanelPage<StudentPanelManager> {
  private panelName: "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "feedback";

  //add Sunday & saturday to types or make given information just numbers (0-6)
  constructor(initPanelName: "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "feedback", toLoginPageCb: Function) {
    super(toLoginPageCb);
    this.sra(this.panelManager);


    //set nav elements

    let overviewOption = new PageOptionsElement("overview");
    overviewOption.addActivationCallback(() => {
      if (this.swapableNav) this.setNavOpen(false);
      this.setPanel("overview")
    });
    lang("overview", (s) => {
      overviewOption.text = fc(s);
    }, 20);
    
    getAllDayNames().then((dayNames) => {
      dayNames.subscribe((dayNames) => {
        let poe = [];
        dayNames.forEach((dayName) => {
          let p = new PageOptionsElement(dayName, undefined, () => {
            if (this.swapableNav) this.setNavOpen(false);
            //@ts-ignore
            this.setPanel(dayName)
          });
          lang(dayName, (s) => {
            p.text = fc(s);
          }, 20);
          poe.add(p);
        });
        poe.dda(overviewOption);
        this.nav.elements = poe;
      })
    });
    

    this.panelManager.setPanel(initPanelName);

    this.hotkeyIndex["Digit1"] = "overview";

    this.nav.activateOption(initPanelName);
  }
  public async setPanel(panelName: "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "feedback") {
    this.panelName = panelName;
    await this.panelManager.setPanel(panelName);
    this.nav.activateOption(panelName);
  }
  public get panel(): "overview" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "langauge" | "theme" | "feedback" {
    return this.panelName;
  }
  protected activationCallback(active: boolean) {
    super.activationCallback(active);

    getAllDayNames().then((dayNames) => {
      dayNames.subscribe((dayNames) => {
        dayNames.forEach((dayName, i) => {
          this.hotkeyIndex["Digit" + (i + 2)] = dayName;
        });
      })
    });
  }
  protected initManager(): StudentPanelManager {
    return new StudentPanelManager(this.setPanel.bind(this), this.nav.focus);
  }
  stl() {
    return super.stl() + require('./studentPage.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./studentPage.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./studentPage.light.css').toString();
  }
}

window.customElements.define('c-student-page', StudentPage);
