import Page from "./../page";
import Nav from "../../../nav/nav";
import HamburgerBar from "../../../hamburgerBar/hamburgerBar";
import TeacherPanelManager from "../../_manager/teacherPanelManager/teacherPanelManager";
import StudentPanelManager from "../../_manager/studentPanelManager/studentPanelManager";

import * as Hammer from "hammerjs";
import Notifier from "../../../../lib/notifier/notifier";


//IMPORTANT: This needs to be the nav width when the nav is swapable (the screen is small).
let navWidth = 300;


export default abstract class PanelPage<Manager extends TeacherPanelManager | StudentPanelManager> extends Page {
  protected nav: Nav;
  private overlay: HTMLElement;
  protected panelManager: Manager;
  private hamburgerBar: HamburgerBar;


  protected hotkeyIndex: object = {};
  private _swapableNav: boolean;
  private _navOpen: boolean = true;
  private inResizeAnimation: boolean = false;

  public animationOptions = {duration: 300, easing: "ease"};


  constructor(public toLoginPageCb: Function) {
    super();
    this.overlay = ce("page-overlay");

    this.nav = new Nav((panelName: string) => {
      //Close nav on mobile
      if (this.swapableNav) this.setNavOpen(false);

      if (panelName === "sign_out") {
        localStorage.sessKey = undefined;
        this.toLoginPageCb();
      }
      else this.setPanel(panelName);
    }, () => {
      this.toLoginPageCb();
    }, () => {
      this.setNavOpen(true);
    });


    this.hamburgerBar = new HamburgerBar(() => {
      this.setNavOpen(!this._navOpen)
    });


    

    this.overlay.on("click", () => {
      if (this.swapableNav) this.setNavOpen(false);
    });


    //guestures

    let lastX: number = 0;

    let guesturef = (e) => {
      if (this.swapableNav) {
        let navpos = parseInt(this.nav.css("marginLeft"));
        let difX = e.deltaX - lastX + navpos;
        if (difX >= 0) this.setNavPos(0);
        else {
          //OPTIMIZE
          //@ts-ignore
          this.setNavPos(difX);
        }
      }
      lastX = e.deltaX;
      if (e.isFinal) {
        lastX = 0;
                        /**----- nav out percent (0 => min; 1 => max) -------------- */
        this.setNavOpen((parseInt(this.nav.css("marginLeft")) + navWidth) / navWidth >= .5);
      }
    }

    //@ts-ignore
    let hammeroptions: HammerOptions = {inputClass: Hammer.TouchInput, cssProps: {userSelect: "text"}};

    let defaultLimit = 60
    let limit = defaultLimit
    new Hammer(this, hammeroptions).on("pan", (e) => {
      if (e.center.x < limit) {
        guesturef(e)
        limit = Infinity
      }
      if (e.isFinal) limit = defaultLimit
    });
    new Hammer(this.overlay, hammeroptions).on("pan", guesturef);
    new Hammer(this.nav, hammeroptions).on("pan", guesturef);



    //Hotkeys
    this.on("keydown", (e: any) => {
      if (!e.prevHotkey) {
        for(let digit in this.hotkeyIndex) {
          if (digit === e.code) this.setPanel(this.hotkeyIndex[digit]);
        }
      }
      if (e.code === "Escape" && this._swapableNav && this._navOpen) {
        this.setNavOpen(false);
      }
    });

    this.panelManager = this.initManager();
    this.panelManager.addClass("panel-manager")

    this.on("resize", this.resizeHandler)


    //this.sra(this.overlay, this.navOpenSelector, this.nav, this.panelManager);
    this.sra(this.overlay, this.hamburgerBar, this.nav, this.panelManager);
  }

  protected abstract initManager(): Manager;

  protected abstract setPanel(to: string): any;

  protected set swapableNav(to: boolean) {
    this._swapableNav = to;
    if (to) {
      this.panelManager.addClass("small");
      this.hamburgerBar.anim({top: 0})
      this.panelManager.anim({height: "calc(100% - 50px)"})
      Notifier.queue.lowerNotificationQueue(40)
    }
    else {
      this.panelManager.removeClass("small");
      this.hamburgerBar.anim({top: -55})
      this.panelManager.anim({height: "100%"})
      Notifier.queue.lowerNotificationQueue(0)
    }
  }
  protected get swapableNav() {
    return this._swapableNav;
  }

  private setNavPos(px: any) {
    let navOutPercent = (px + navWidth) / navWidth;
    this.nav.css("marginLeft", px);
    if (navOutPercent > 0) this.overlay.css("display", "block");
    else this.overlay.css("display", "none");
    this.overlay.css("opacity", (px + navWidth) / navWidth);
  }
  protected async setNavOpen (to: boolean) {
    this._navOpen = to;
    this.nav.active = to;
    let anim: Promise<any>;
    if (to) {
      let anims = [this.nav.anim({marginLeft: 0}, this.animationOptions), Notifier.queue.lowerNotificationQueue(0)];
      if (this.swapableNav) {
        this.overlay.css("display", "block");
        anims.add(this.overlay.anim({opacity: 1}, this.animationOptions));
      }
      anim = Promise.all(anims);
    }
    else {
      let anims = [this.nav.anim({marginLeft: -this.nav.outerWidth}, this.animationOptions),  Notifier.queue.lowerNotificationQueue(this.swapableNav ? 40 : 0)];
      if (this.swapableNav) {
        anims.add(this.overlay.anim({opacity: 0}, this.animationOptions).then(() => {
          this.overlay.css("display", "none");
        }));
      }
      anim = Promise.all(anims);
    }
    await anim;
  }
  protected activationCallback(active: boolean) {
    super.activationCallback(active);
    if (active) {
      this.nav.focus();
      this.panelManager.vate(active);
    }
  }
  async resizeHandler() {
    if (this.active) {
      if (!this.inResizeAnimation) {
        this.inResizeAnimation = true;
        let sw = this.width < 600;
        if (sw !== this.swapableNav) {
          if (!sw) this.swapableNav = sw;
          await Promise.all([
            this.overlay.anim({opacity: 0}, this.animationOptions).then(() => {
              this.overlay.css("display", "none");
            }),
            this.setNavOpen(!sw).then(() => {
              this.swapableNav = sw;
              this.inResizeAnimation = false;
            })
          ]);
          //Wanted change could have changed while in animation -> call again since it wont execute anything when nothing has changed
          this.resizeHandler();
        }
        this.swapableNav = sw;
        this.inResizeAnimation = false;
      }
    }
  }


  stl() {
    return super.stl() + require('./panelPage.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./panelPage.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./panelPage.light.css').toString();
  }
}
