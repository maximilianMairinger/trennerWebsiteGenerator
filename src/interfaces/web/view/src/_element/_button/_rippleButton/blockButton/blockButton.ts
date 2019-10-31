import RippleButton from "./../rippleButton";

export default class BlockButton extends RippleButton {
  private textElem: HTMLElement;
  private isActive: boolean = false;
  constructor(text: string = "", activationCallback?: Function) {
    super(activationCallback);
    this.textElem = dc("button-text");
    this.text = text;
    this.sra(ce("button-container").apd(this.textElem));
  }
  set text(to: string) {
    this.textElem.html = to;
  }
  get text(): string {
    return this.textElem.html;
  }
  public activate() {
    this.isActive = true;
    this.addClass("active");
  }
  public deactivate() {
    if (!this.isActive) return;
    this.isActive = false;
    this.removeClass("active");
  }
  stl() {
    return super.stl() + require('./blockButton.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./blockButton.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./blockButton.light.css').toString();
  }
}
window.customElements.define('c-block-button', BlockButton);
