import Element from './../element';
import Avatar from "./../avatar/avatar"
import UserOptions from "./../userOptions/userOptions"

export default class UserDisplay extends Element {
  private avatar: Avatar;
  private option: UserOptions;
  constructor(public openPanel?: (panel: "theme" | "langauge" | "feedback" | "sign_out") => void) {
    super();
    this.avatar = new Avatar();
    let wrapper = ce("avatar-wrapper");
    wrapper.apd(this.avatar);

    this.option = new UserOptions((panel: "theme" | "langauge" | "feedback" | "sign_out") => {
      if (this.openPanel !== undefined) this.openPanel(panel);
    });
    let userOptionsWrapper = dc("user-options-wrapper");
    userOptionsWrapper.apd(this.option)

    this.sra(wrapper, userOptionsWrapper);
  }
  stl() {
    return require('./userDisplay.css').toString();
  }
  public dark(): string {
    return require('./userDisplay.dark.css').toString();
  }
  public light(): string {
    return require('./userDisplay.light.css').toString();
  }
}
window.customElements.define('c-user-display', UserDisplay);
