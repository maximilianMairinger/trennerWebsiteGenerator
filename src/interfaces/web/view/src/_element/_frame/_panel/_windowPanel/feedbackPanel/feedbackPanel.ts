import WindowPanel from "./../windowPanel";
import FeedbackWindow from "../../../../_window/feedbackWindow/feedbackWindow";
import Notifier from "../../../../../lib/notifier/notifier";
import {post} from "../../../../../lib/ajax/ajax";

export default class FeedbackPanel extends WindowPanel {
  protected domainName = "feedback";

  constructor(switchToOverviewCb?: Function) {
    super();
    this.window = new FeedbackWindow(async (text) => {
      if ((await post("sendFeedback",{body: {feedback: text}})).result) {
        switchToOverviewCb();
        this.window.setText("");
        Notifier.success(true, "feedback_suc");
        localStorage.feedback_save = "";
      }
      else {
        Notifier.error("feedback_err");
      }
    });
  }

  stl() {
    return super.stl() + require('./feedbackPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./feedbackPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./feedbackPanel.light.css').toString();
  }
  protected activationCallback(active: boolean) {
    super.activationCallback(active)
  }
}
window.customElements.define('c-feedback-panel', FeedbackPanel);
