import Window from "./../window";

export default class TextWindow extends Window {
  private container: HTMLElement = ce("text-window-text");
  constructor(text: string) {
    super("top");
    this.sra(this.container);
    this.text = text;
  }
  public get text(): string {
    return this.container.html;
  }

  public set text(to: string) {
    this.container.html = to;
  }

  stl() {
    return super.stl() + require('./textWindow.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./textWindow.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./textWindow.light.css').toString();
  }
}

window.customElements.define('c-text-window', TextWindow);
