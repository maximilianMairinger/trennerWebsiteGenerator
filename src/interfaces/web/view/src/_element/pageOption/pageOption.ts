import Element from './../element';
import PageOptionsElement from './../_button/_rippleButton/_optionElement/pageOptionElement/pageOptionElement';

export default class PageOptions extends Element {
  private container: HTMLElement;
  private _elements: Array<PageOptionsElement>;

  constructor(...elements: Array<PageOptionsElement>) {
    super();
    this.container = dc("page-option-container");
    this.elements = elements;
    this.sra(this.container);

    this.on("keydown", (e) => {
      try {
        if (e.code === "ArrowDown") {
          e.preventDefault();
          this.focusedIndex = this.focusedIndex + 1;
        }
        else if (e.code === "ArrowUp") {
          e.preventDefault();
          this.focusedIndex = this.focusedIndex - 1;
        }
        else if (e.code === "ArrowLeft") {
          e.preventDefault();
          this.focusedIndex = 0;
        }
        else if (e.code === "ArrowRight") {
          e.preventDefault();
          this.focusedIndex = this.elements.length -1;
        }
      }
      catch(e) {
        //just catching index out of bounds (which doesnt matter here since it just defaults to the last)
      }
    });
  }
  public set elements(to: Array<PageOptionsElement>) {
    this._elements = to;
    this.container.emptyNodes();
    to.forEach((e) => {
      this.container.append(e);
    });
  }
  public get focusedIndex():number {
    let index: number = -1;
    this.elements.forEach((e: PageOptionsElement, i) => {
      if (e.matches(":focus")) {
        index = i;
      }
    });
    return index;
  }
  public set focusedIndex(to: number) {
    if (to > -1 && to < this.elements.length) this.elements[to].focus();
    else throw "Invald index.";
  }
  public get elements(): Array<PageOptionsElement> {
    return this._elements;
  }
  public activate(optionID_element: string | PageOptionsElement) {
    this.clearActivation();
    this.elements.forEach((e) =>{
      if (e.id === optionID_element || e === optionID_element) e.activate();
    });
  }
  public get isActive(): PageOptionsElement {
    let s: PageOptionsElement;
    this.elements.forEach((e) => {
      if(e.isActive) s = e;
    });
    return s;
  }
  private clearActivation() {
    this.container.childs().forEach((e: PageOptionsElement) => {
      e.deactivate();
    });
  }
  stl() {
    return require('./pageOption.css').toString();
  }
  public dark(): string {
    return require('./pageOption.dark.css').toString();
  }
  public light(): string {
    return require('./pageOption.light.css').toString();
  }
}
window.customElements.define('c-page-option', PageOptions);
