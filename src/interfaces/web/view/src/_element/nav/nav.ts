import Element from "./../element";
import UserDisplay from "./../userDisplay/userDisplay";
import pageOptions from "./../pageOption/pageOption";
import PageOptionsElement from "./../_button/_rippleButton/_optionElement/pageOptionElement/pageOptionElement";
import Button from "../_button/button";

export default class Nav extends Element {
  private options: pageOptions;
  private user: UserDisplay;
  private container: HTMLElement;

  private rdy: Promise<any>;
  private res: Function;

  public _active: boolean = true;
  constructor(public openPanelCb: (panel: string) => any, public toLoginPageCb: Function, public openNavCb?: Function, elements?: PageOptionsElement[]) {
    super();
    this.tabIndex = 0;


    this.user = new UserDisplay((panelName: string) => {
      this.openPanelCb(panelName);
    });

    this.options = new pageOptions();


    this.rdy = new Promise((res) => {
      this.res = res;
    });

    this.container = ce("nav-container");
    this.container.apd(this.user, this.options);


    this.sra(this.container);

    this.on("focus", async (e: any) => {
      await this.rdy;
      if (this.active) {
        if (!e.prevFocusActiveOption) {
          let active = this.options.isActive;
          //Under some circumstances (like when logoutPanel is open) there can be no active option.
          if (active) active.focus();
        }
      }
    });

    this.on("resize", this.resizeHandler)

    if (elements !== undefined) this.elements = elements;
  }
  public set active(to: boolean) {
    this._active = to;
    if (to) this.container.addClass("shadow");
    else this.container.removeClass("shadow");
  }
  public get active() {
    return this._active;
  }
  public set elements(to: PageOptionsElement[]) {
    this.options.elements = to;
    this.res();
  }
  public async activateOption(panel: string) {
    await this.rdy;
    this.options.activate(panel);
  }
  resizeHandler() {
    if(this.offsetHeight - this.options.height < 390) {
      this.options.css("top", 200);
    } else {
      this.options.css("top", "");
    }
  }
  stl() {
    return require('./nav.css').toString();
  }
  public dark(): string {
    return require('./nav.dark.css').toString();
  }
  public light(): string {
    return require('./nav.light.css').toString();
  }
}

window.customElements.define('c-nav', Nav);
