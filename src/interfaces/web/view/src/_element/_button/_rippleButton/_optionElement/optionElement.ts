import RippleButton from "./../rippleButton";
import delay from "./../../../../lib/delay/delay"


export default class OptionElement extends RippleButton {
  private textElem: HTMLElement;
  private _isActive: boolean = false;
  constructor(text?: string, callback?: Function) {
    super(callback);

    this.textElem = dc("option-element-text");
    if (text !== undefined) this.text = text;
    this.sra(this.textElem);
  }
  public set text(to:string) {
    this.textElem.html = to;
  }
  public get text():string {
    return this.textElem.html;
  }
  public activate() {
    this._isActive = true;
    this.addClass("optionActive");
  }
  public get isActive():boolean {
    return this._isActive;
  }
  public deactivate() {
    if (!this.isActive) return;
    this._isActive = false;
    this.removeClass("optionActive");
  }
  stl() {
    return super.stl() + require('./optionElement.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./optionElement.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./optionElement.light.css').toString();
  }
}
window.customElements.define('c-option-element', OptionElement);
