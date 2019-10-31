import WindowPanel from "./../windowPanel";
import TextWindow from "../../../../_window/textWindow/textWindow";
import lang, {fc} from "./../../../../../lib/language/language";

export default class NoLBSPanel extends WindowPanel {
  protected domainName = "currently_no_lesson";

  constructor() {
    super();
    this.window = new TextWindow("");
    lang("noLBS_currently", (s) => {
      this.window.text = s;
    })
  }

  stl() {
    return super.stl() + require('./noLBSPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./noLBSPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./noLBSPanel.light.css').toString();
  }
  protected activationCallback(active: boolean) {
    super.activationCallback(active)
  }
}
window.customElements.define('c-no-lbs-panel', NoLBSPanel);
