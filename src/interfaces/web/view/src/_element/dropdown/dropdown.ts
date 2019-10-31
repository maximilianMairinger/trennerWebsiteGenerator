import Button from './../_button/button';
import Element from "./../element";
import Selector from "./../selector/selector";
import SelElem from "./../_button/selectorElement/selectorElement";

export default class Dropdown extends Element {
  private _selector: Selector;
  public button: Button;
  constructor(...selElems: SelElem[]) {
    super();
    this.button = new Button((e) => {
      this._selector.toggle(e);
    });

    this._selector = new Selector("bottom","node");

    this.sra(this.button, this._selector);

    this.on("focus", (e: any) => {
      e.prevFocusActiveOption = "DROPDOWN";
    });

    this.elements = selElems;
  }
  public get selector(): Selector {
    return this._selector;
  }
  public set elements(elements: Array<SelElem>) {
    this._selector.elements = elements;
  }
  public get elements(): Array<SelElem> {
    return this._selector.elements;
  }
  stl() {
    return require('./dropdown.css').toString();
  }
  public dark(): string {
    return require('./dropdown.dark.css').toString();
  }
  public light(): string {
    return require('./dropdown.light.css').toString();
  }
}
window.customElements.define('c-dropdown', Dropdown);
