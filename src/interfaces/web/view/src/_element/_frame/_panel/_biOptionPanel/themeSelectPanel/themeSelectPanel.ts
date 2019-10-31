import OptionPanel from "./../biOptionPanel";
import { switchToTheme } from "../../../../element";

export default class ThemeSelectPanel extends OptionPanel {
  protected domainName = "theme";
  constructor() {
    super({
      cb: () => {switchToTheme("light")},
      img: require("../../../../../../assets/sun.svg").toString()
    }, {
      cb: () => {switchToTheme("dark")},
      img: require("../../../../../../assets/moon.svg").toString()
    });
  }



  protected activationCallback(active: boolean) {
    super.activationCallback(active)
  }
  stl() {
    return super.stl() + require('./themeSelectPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./themeSelectPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./themeSelectPanel.light.css').toString();
  }
}
window.customElements.define('c-theme-select-panel', ThemeSelectPanel);
