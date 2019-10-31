import Element from "./../element";

export default class Editable extends Element {
  private textarea: HTMLTextAreaElement;
  private layer: HTMLElement;
  private container: HTMLElement;
  private _enabled: boolean = true;
  constructor(value: string = "", public onSubmit?: (s: string) => void, enabled: boolean = true) {
    super();
    /*
     * Fix to prevent bug where texarea would get focused without sending blur event (to selector)
     * 11/05/19 MACOS chrome
     */
    this.container  = dc("editable-container");
    this.layer = dc("editable-layer");
    this.textarea = dc("textarea");
    this.layer.on("mousedown",(e) => {
      if(e.which === 1){
        this.textarea.focus();
        e.preventDefault();
      }
    });
    let goToTextare = () => {
      this.textarea.select();
      this.layer.hide();
    }
    this.textarea.on("focus", goToTextare);
    this.layer.on("scroll", () => {
      if (!this.enabled) return;
      goToTextare();
      window.getSelection().removeAllRanges();
    });
    this.layer.apd(ce("editable-big-block"));

    this.textarea.on("blur", () => {
      this.layer.show();
    });
    this.textarea.on("keydown", (e: any) => {
      e.prevHotkey = "editable";
      if (e.code === "Enter" && e.ctrlKey) {
        let cursorPos: number = this.textarea.selectionStart;
        let v: string = this.textarea.value;
        let textBefore = v.substring(0, cursorPos);
        let textAfter  = v.substring(cursorPos, v.length);
        this.textarea.value = textBefore +  "\n" + textAfter;
        cursorPos++;
        this.textarea.selectionStart = cursorPos;
        this.textarea.selectionEnd = cursorPos;
      }
      else if (e.code === "Enter" || e.code === "Escape"){
        this.textarea.blur();
      }
    });
    this.textarea.on("blur", () => {
      if (this.onSubmit !== undefined) this.onSubmit(this.value);
    })

    this.container.apd(this.textarea, this.layer);
    this.sra(this.container);

    this.value = value;
    this.enabled = enabled;
  }
  public addChangeListener(cb: (value?: string) => void) {
    this.textarea.on("keydown", () => {cb(this.value)})
  }
  public disable() {
    this.enabled = false;
  }
  public enable() {
    this.enabled = true;
  }
  public get enabled() {
    return this._enabled;
  }
  public set enabled(to: boolean) {
    this._enabled = to;
    this.container.css("cursor", to ? "text" : "default");
    this.textarea.tabIndex = to ? 0 : -1;
    this.textarea.readOnly = !to;

    if (to) this.textarea.addClass("cursive");
    else this.textarea.removeClass("cursive");

  }
  public set value(to: string) {
    this.textarea.value = to;
  }
  public get value(): string {
    return this.textarea.value;
  }
  stl() {
    return require('./editable.css').toString();
  }
  public dark(): string {
    return require('./editable.dark.css').toString();
  }
  public light(): string {
    return require('./editable.light.css').toString();
  }
}

window.customElements.define('c-editable', Editable);
