import Indecator from "../indecator";
import lang from "../../../lib/language/language"

export default class CommingSoonIndecator extends Indecator {
  constructor() {
    super();
    lang("comming_soon", (commin) => {
      this.indecate(commin)
    })
  }
  stl() {
    return super.stl() + require('./commingSoonIndecator.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./commingSoonIndecator.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./commingSoonIndecator.light.css').toString();
  }
}

window.customElements.define('c-comming-soon-indecator', CommingSoonIndecator);
