import Element from "../element";

export default class HamburgerBar extends Element {
  private body = ce("hamburger-bar-body")
  private hamburger = ce("hamburger-button")
  constructor(public hamburgerClickedCallback: () => void) {
    super();
    this.sra(this.body.apd(this.hamburger, ce("hamburger-logo")))
    this.hamburger.on("click", () => {
      this.hamburgerClickedCallback()
    })
  }

  stl() {
    return require('./hamburgerBar.css').toString();
  }
  public dark(): string {
    return require('./hamburgerBar.dark.css').toString();
  }
  public light(): string {
    return require('./hamburgerBar.light.css').toString();
  }

}

window.customElements.define('c-hamburger-bar', HamburgerBar);
