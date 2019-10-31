import Page from "./../page";
import LoginElem from "./../../../_window/loginWindow/loginWindow";
import lang, {fc} from "./../../../../lib/language/language";
import Footer from "./../../../drifter/drifter";


class DayTime {
  constructor(public from: number, public name: string) {

  }
  is(time: number): boolean {
    return time >= this.from;
  }
}

const dayTimes = [
  new DayTime(4, "morning"),
  new DayTime(12, "afternoon"),
  new DayTime(18,"evening")
];
function getDayTime(): string {
  let h = new Date().getHours()
  for (let i = 0; i < dayTimes.length; i++) {
    let w = dayTimes[i].is(h);
    if (!w) return dayTimes.prior(i).name || "";
  }
  return dayTimes[dayTimes.length -1].name;
}

export default class LoginPage extends Page {
  protected domainName = "login";

  protected domainPush = true;

  private footContainer: HTMLElement;
  private foot: Footer;
  private login: LoginElem;

  private loginContainer: HTMLElement;

  private preLoadStatus: "start" | "stop" = "stop";

  private footrdy: Promise<any>;
  constructor(public submitCallback?: Function) {
    super();
    this.loginContainer = ce("login-panel-login-conteiner");
    this.footContainer = ce("login-panel-foot-container");

    this.footrdy = import(/* webpackChunkName: "drifter" */"./../../../drifter/drifter");

    this.footrdy.then(({default: foot}) => {
      this.foot = new foot();
      this.footContainer.apd(this.foot);
      this.foot[this.preLoadStatus]();
    });

    this.login = new LoginElem((...a) => {
      if (this.submitCallback !== undefined) submitCallback(...a);
    });
    lang(["dayTimes.good", "dayTimes." + getDayTime()], (good, time) => {
      this.login.heading = fc(good) + " " + fc(time);
    }, 7);


    this.loginContainer.apd(this.login);
    this.sra(this.footContainer, this.loginContainer);
  }
  public clearPw() {
    this.login.password = "";
  }
  protected activationCallback(active: boolean): void {
    super.activationCallback(active);
    if (active) {
      this.onResize();

      if (!this.login.username) this.login.focusUsername();
      else this.login.focusPassword();
      this.startFoot();
    }
    else {
      this.stopFoot();
    }
  }
  onResize() {
    if (this.active) {
      let width = document.body.clientWidth;

      if (width < 440) {
        this.stopFoot();
        this.login.toMobile();
        this.login.addClass("small");
        this.login.removeClass("big");
        this.login.removeClass("mid");
      }
      else if (width < 660){
        this.startFoot();
        this.login.toDesktop();
        this.login.removeClass("small");
        this.login.removeClass("big");
        this.login.addClass("mid");
      }
      else {
        this.startFoot();
        this.login.toDesktop();
        this.login.removeClass("small");
        this.login.addClass("big");
        this.login.removeClass("mid");
      }
    }
  }
  private startFoot() {
    if (this.foot) this.foot.start();
    else this.preLoadStatus = "start";
  }
  private stopFoot() {
    if (this.foot) this.foot.stop();
    else this.preLoadStatus = "stop";
  }
  stl() {
    return super.stl() + require('./loginPage.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./loginPage.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./loginPage.light.css').toString();
  }
}

window.customElements.define('c-login-page', LoginPage);
