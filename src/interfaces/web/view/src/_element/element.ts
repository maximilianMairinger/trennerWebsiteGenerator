import {post} from "../lib/ajax/ajax";

window.onresize = (event) => {
  Element.resize.ea((e) => {
    e(event);
  });
}


const noSelectCss = "*{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;}";

let themeSwitchCallbacks: Element[] = [];

export default abstract class Element extends HTMLElement {
  public static resize: Function[] = [];
  private disconnectedCallbacks: Function[] = [];
  private connectedCallbacks: Function[] = [];
  private themeStyleSheet: HTMLStyleElement;


  protected sr: ShadowRoot;
  constructor(draggable: boolean = true, selectable: boolean = true) {
    super();
    this.sr = this.attachShadow({mode: "open"});

    if (!draggable) this.on("dragstart", e => e.preventDefault);

    let tempCss = require('./element.css').toString();
    if (!selectable) tempCss += noSelectCss

    this.sr.innerHTML = "<!--General styles--><style>" + tempCss + "</style><!--Main styles-->\n<style>" + this.stl() + "</style><!--Theme styles-->";

    //@ts-ignore
    if (this.onResize !== undefined) Element.resize.push((e) => {this.onResize(e)});

    themeSwitchCallbacks.add(this);

    this.addDisconnectedCallback(() => {
      themeSwitchCallbacks.rm(this);
    });

    this.themeStyleSheet = ce("style");
    this.sra(this.themeStyleSheet);

    if (localStorage.theme !== undefined) this.switchToTheme(localStorage.theme);
  }
  public abstract stl(): string;
  public abstract dark(): string;
  public abstract light(): string;
  /**
   * Appends to ShadowRoot
   */
  public sra(...elems: HTMLElement[]): void {
    elems.ea((e) => {
      this.sr.append(e);
    });
  }
  private connectedCallback() {
    this.connectedCallbacks.ea((f) => {
      f();
    })
  }
  private disconnectedCallback() {
    this.disconnectedCallbacks.ea((f) => {
      f();
    })
  }
  public addConnectedCallback(f: Function) {
    this.connectedCallbacks.add(f);
  }
  public addDisconnectedCallback(f: Function) {
    this.disconnectedCallbacks.add(f);
  }
  public removeDisconnectedCallback(f: Function) {
    this.disconnectedCallbacks.remove(f);
  }
  public removeConnectedCallback(f: Function) {
    this.connectedCallbacks.remove(f);
  }
  private switchToTheme(to: "dark" | "light") {
    if (to === "dark") {
      this.themeStyleSheet.inner = this.dark() + require("./element.dark.css");
    }
    else {
      this.themeStyleSheet.inner = this.light() + require("./element.light.css");
    }
  }
}

log("TODO")

const heading: any = document.querySelector("#metaTheme");

switchToTheme(localStorage.theme || "light", false);
export function switchToTheme(to: "dark" | "light", sendToServer = true) {
  localStorage.theme = to;
  if (sendToServer) post("setTheme", {body: {theme: to}})

  if (to === "dark") {
    //TODO does not work
    //heading.content = darkColor;
    document.body.css("background", "#212121")
    document.body.css("color", "#c2c2c2")
    themeSwitchCallbacks.ea((e) => {
      //@ts-ignore
      e.switchToTheme(to);
    });
  }
  else {
    //heading.content = lightColor;
    document.body.css("background", "white")
    document.body.css("color", "#605e5e")
    themeSwitchCallbacks.ea((e) => {
      //@ts-ignore
      e.switchToTheme(to);
    })
  }
}

/*
import Element from "./../element";

export default class Example extends Element {
  constructor() {
    super();

  }
  stl() {
    return require('./example.css').toString();
  }
}

window.customElements.define('c-example', Example);

*/
