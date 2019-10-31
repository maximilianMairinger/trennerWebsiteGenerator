import PanelPage from "../panelPage";
import TeacherPanelManager from "../../../_manager/teacherPanelManager/teacherPanelManager";
import { getUnit, getAllLBNames } from "../../../../../lib/unitData/unitData";
import PageOptionsElement from "../../../../_button/_rippleButton/_optionElement/pageOptionElement/pageOptionElement";
import { domainIndex } from "../../../../../lib/domain/domain";

export default class TeacherPage extends PanelPage<TeacherPanelManager> {
  constructor(toLoginPageCb: Function) {
    super(toLoginPageCb);


    //set nav elements


    (async () => {
      await getAllLBNames((...names) => {
        let poe: PageOptionsElement[] = [];
        names.ea((name) => {
          poe.add(new PageOptionsElement(name, name, () => {
            this.setPanel(name);
          }))
        })
        this.nav.elements = poe;
      })

    })();
  }
  public async setPanel(to: string | "viewStudent" | "theme" | "lang") {
    await this.panelManager.setPanel(to),
    await this.nav.activateOption(to)
  }
  protected activationCallback(active: boolean) {
    super.activationCallback(active);
  }
  protected initManager(): TeacherPanelManager {
    return new TeacherPanelManager(this.setPanel.bind(this), this.nav.focus);
  }
  stl() {
    return super.stl() + require('./teacherPage.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./teacherPage.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./teacherPage.light.css').toString();
  }
}

window.customElements.define('c-teacher-page', TeacherPage);
