import Element from "./../element";


// TODO: Clean up
export default class Notification extends Element {
    private infoText:       HTMLElement;
    private infoClose:      HTMLElement;
    private infoCloseAll:   HTMLElement;
    private infoTitleOpts:  HTMLElement;
    private headingText:    HTMLElement;

    private container: HTMLElement;

    public closing: boolean = false;

    private _type: "information" | "success" | "error";

    constructor(heading_text?: string, message?: string, type?: "information" | "success" | "error", public onClose?: Function, public onCloseAll?: Function) {
      super();

      this.container = ce("notification-container");

      let side =           dc("notification-side");
      let infoIcon =       dc("notification-icon");
      let infoSec =         dc("notification-section");
      let infoTitleSec =   dc("notification-heading-section");
      this.headingText =    dc("notification-heading-text");
      this.infoTitleOpts =  dc("notification-heading-options");
      this.infoClose  =     dc("notification-close-button");
      this.infoText =       dc("info-text");

      this.infoClose.on("click", () => {if (this.onClose !== undefined) this.onClose(this)});

      this.infoTitleOpts.apd(this.infoClose);
      infoTitleSec.apd(this.headingText, this.infoTitleOpts);
      infoSec.append(infoTitleSec);
      if (message !== undefined) infoSec.apd(this.infoText);
      side.apd(infoIcon);

      this.container.apd(side, infoSec);

      this.sra(this.container);

      if (heading_text !== undefined) this.heading = heading_text;
      if (message !== undefined) this.msg = message;
      if (type !== undefined) this.type = type;
    }

    public set heading(to: string) {
      this.headingText.html = to;
    }
    public get heading(): string {
      return this.headingText.html;
    }
    public set msg(to: string) {
      this.infoText.html = to;
    }
    public get msg(): string {
      return this.infoText.html;
    }
    public set type(to: "information" | "success" | "error") {
      this._type = to;
      this.container.childs("*").addClass(to);
    }
    public get type() {
      return this._type;
    }

    public addCloseAllOption():void {
        this.infoCloseAll= dc("notification-close-all");
        this.infoCloseAll.html ="Close all";
        this.infoTitleOpts.append(this.infoCloseAll);
        this.infoCloseAll.on("click", () => {if (this.onCloseAll !== undefined) this.onCloseAll()});
    }

    public close() {
      this.infoClose.click();
    }

    public removeCloseAllOption():void {
      this.infoCloseAll.remove();
    }

    public hasCloseAll():boolean {
      return this.infoCloseAll !== undefined;
    }
    stl() {
      return require('./notification.css').toString();
    }
    public dark(): string {
      return require('./notification.dark.css').toString();
    }
    public light(): string {
      return require('./notification.light.css').toString();
    }

}

window.customElements.define('c-notification', Notification);
