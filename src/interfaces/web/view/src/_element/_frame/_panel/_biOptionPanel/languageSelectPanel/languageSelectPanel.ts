import OptionPanel from "./../biOptionPanel";
import { setLang } from "../../../../../lib/language/language";

export default class LanguageSelectPanel extends OptionPanel {
  protected domainName = "language";

  constructor() {
    super({
      cb: () => {setLang("de")},
      img: require("../../../../../../assets/aut.svg").toString()
    }, {
      cb: () => {setLang("en")},
      img: require("../../../../../../assets/uk.svg").toString()
    });
  }



  protected activationCallback(active: boolean) {
    super.activationCallback(active)
  }

  stl() {
    return super.stl() + require('./languageSelectPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./languageSelectPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./languageSelectPanel.light.css').toString();
  }
}
window.customElements.define('c-language-select-panel', LanguageSelectPanel);
