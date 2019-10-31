import lang, {fc} from "./../../lib/language/language";
import Element from './../element';
import Dropdown from "./../dropdown/dropdown";
import SelectorElement from "./../_button/selectorElement/selectorElement";
import getUserOptions from "../../lib/userData/userData";

export default class UserOptions extends Element {
  private dropdown: Dropdown;
  private span: HTMLSpanElement;
    constructor(public openPanel?: (panel: "theme" | "langauge" | "feedback" | "sign_out") => void) {
        super();

        this.span = dc("span");
        this.span.html = "<pre>              </pre>"
        this.sra(this.span);
        getUserOptions().get("username", (username: string) => {
          this.span.html = username;
        });

        this.dropdown = new Dropdown(
          new SelectorElement(""),
          new SelectorElement(""),
          new SelectorElement(""),
          new SelectorElement("")
        );

        this.span.on("mousedown", (e) => {
          this.dropdown.selector.toggle(e, this.dropdown.button)
          //We prevent Default here in order to not blur the dropdown instantly again
          e.preventDefault()
        })

        let ls = ["theme", "language", "feedback", "sign_out"];
        this.dropdown.elements.forEach((e,i) => {
          //@ts-ignore
          e.addActivationCallback(() => {if (this.openPanel !== undefined) openPanel(ls[i])});
          lang(ls[i], (s) => {
            e.text = fc(s);
          }, 1);
        });
        this.sra(this.dropdown);
    }
    stl() {
      return require('./userOptions.css').toString();
    }
    dark() {
      return require('./userOptions.dark.css').toString();
    }
    light() {
      return require('./userOptions.light.css').toString();
    }
}
window.customElements.define('c-user-options', UserOptions);
