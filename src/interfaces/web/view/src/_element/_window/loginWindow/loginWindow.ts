import Window from "./../window";
import Input from "./../../input/input";
import Button from "./../../_button/_rippleButton/blockButton/blockButton";
import lang, {fc , sc} from "./../../../lib/language/language";
import delay from "../../../lib/delay/delay";

export default class LoginWindow extends Window {
  private headingElem: HTMLElement;
  private usernameInput: Input;
  private passwordInput: Input;
  private submitButton: Button;
  private container: HTMLElement;

  public invalid: boolean = false;

  constructor(public submitCallback?: Function, heading?: string) {
    super()
    this.container = ce("login-window-container");

    this.spellcheck = false;

    this.side = "top";
    this.headingElem = dc("login-window-heading");
    if (heading !== undefined) this.heading = heading;

    let cb = () => {
      if (this.submitCallback !== undefined) this.submitCallback(this.usernameInput.value, this.passwordInput.value);
    };

    this.usernameInput = new Input(undefined, "text", cb);
    //localStorage.username gets set in pageManager through lib/userData.ts
    if (localStorage.username !== undefined) this.usernameInput.value = localStorage.username;
    lang("username", (s) => {
      this.usernameInput.placeholderText = fc(s);
    }, 9);

    this.passwordInput = new Input(undefined, "password", cb);
    lang("password", (s) => {
      this.passwordInput.placeholderText = fc(s);
    }, 9);

    this.submitButton = new Button("", cb);
    lang("login", (login) => {
      this.submitButton.text = sc(login);
    }, 5)

    let form = ce("form");
    form.apd(this.usernameInput, this.passwordInput, this.submitButton)

    this.container.apd(this.headingElem, form);

    this.sra(this.container);

    this.on("keydown", (e) => {
      if (e.code === "Escape") this.blur();
    });
  }
  public set username(to: string) {
    this.usernameInput.value = to;
  }
  public get username() {
    return this.usernameInput.value;
  }
  public set password(to: string) {
    this.passwordInput.value = to;
  }
  public get password() {
    return this.passwordInput.value;
  }
  public focusUsername() {
    // To instantly set the placeholderstate to up
    this.usernameInput.value = this.usernameInput.value;
    this.usernameInput.focus();
  }
  public focusPassword() {
    // To instantly set the placeholderstate to up
    this.passwordInput.value = this.passwordInput.value;
    this.passwordInput.focus();
  }
  public set heading(to: string) {
    this.headingElem.html = to;
  }
  public get heading(): string {
    return this.headingElem.html;
  }

  public toDesktop() {
    this.container.addClass("desktop");
    this.container.removeClass("mobile");
  }
  public toMobile() {
    this.container.addClass("mobile");
    this.container.removeClass("desktop");
  }

  stl() {
    return super.stl() + require('./loginWindow.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./loginWindow.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./loginWindow.light.css').toString();
  }
}

window.customElements.define('c-login-window', LoginWindow);
