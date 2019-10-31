import Window from "./../window";
import lang, {fc} from "./../../../lib/language/language";
import BlockButton from "./../../_button/_rippleButton/blockButton/blockButton";

export default class FeedbackWindow extends Window {
  private textElem: HTMLElement;
  private textArea: HTMLTextAreaElement;
  private label: HTMLElement;
  private submit: BlockButton;

  constructor(public cb?: (text: string) => any) {
    super("top");
    this.textElem = ce("report-a-bug-text");
    this.textArea = ce("textarea");
    this.label = ce("text-label");
    let wrapper = ce("text-wrapper");


    lang("feedback", (text: string) => {
      this.textElem.html = fc(text);
    }, 1)

    this.submit = new BlockButton("",() => {if(cb !== undefined){cb(this.getText())}});
    lang("submit", (text: string) => {
      this.submit.text = fc(text)
    },1);

    lang("your_feedback",(text: string) => {
      this.label.html = fc(text);
    });

    wrapper.apd(this.label,this.textArea);
    this.sra(this.textElem, wrapper,this.submit);


    this.textArea.on("keydown", () => {
      localStorage.feedback_save = this.getText();
    })
    this.setText(localStorage.feedback_save || "");


    this.textArea.on("keydown", (e: any) => {
      e.prevHotkey = "FeebackWindow"
    })
  }

  public getText(): string {
    return this.textArea.value;
  }

  public setText(to: string) {
    this.textArea.value = to;
  }

  stl() {
    return super.stl() + require('./feedbackWindow.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./feedbackWindow.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./feedbackWindow.light.css').toString();
  }
}
window.customElements.define('c-feedback-window', FeedbackWindow);
