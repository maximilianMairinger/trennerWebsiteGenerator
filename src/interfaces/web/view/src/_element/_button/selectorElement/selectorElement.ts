import Button from './../button';

export default class SelectorElement extends Button {
  private body: HTMLElement;
  constructor(text: string, activationCallback?: Function, active: boolean = true) {
    super(activationCallback, active, true);

    this.body = dc("selector-element-text");
    this.sra(this.body);
    this.text = text;
    this.active = active;
  }
  public set text(to:string) {
    this.body.html = to;
  }
  public get text():string {
    return this.body.html;
  }
  public set active(to: boolean) {
    if (to) this.body.addClass("active");
    else this.body.removeClass("active");
    this.enabled = to;
  }
  public get active():boolean {
    return this.enabled;
  }
  stl() {
    return super.stl() + require('./selectorElement.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./selectorElement.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./selectorElement.light.css').toString();
  }
}
window.customElements.define('c-selector-element', SelectorElement)
