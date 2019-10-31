import OptionElement from "./../optionElement";
import delay from "./../../../../../lib/delay/delay"


export default class PageOptionsElement extends OptionElement {
  constructor(public id: string, text?: string, public callback?: Function) {
    super(text, async (e) => {
      e.prevFocusActiveOption = "PageOptionsElement";
      //Easter egg
      //------------------------------------
      delay(1000).then(() => {
        pressedInASecond = 0;
      });
      pressedInASecond++;
      if (pressedInASecond === 8 && !disabled) {
        disabled = true;
        await this.rocket();
        disabled = false;
        pressedInASecond = 0;
      }

      if (this.callback !== undefined) this.callback(this.id);
    });
    let disabled = false;
    let pressedInASecond = 0;
    //-----------------------------------
  }
  public async rocket(){
    await this.anim({marginLeft: 0, color: "red"}, {duration: 2000});
    await this.anim({marginLeft: -100, color: "orange"}, {duration: 2000, easing: "ease"});
    await delay(1000);
    await this.anim({marginLeft: 500, color: "blue"}, {easing: "ease-in"});
    this.css("marginLeft", -500);
    this.css("color", "");
    await delay(500);
    await this.anim({marginLeft: 0}, {duration: 1500, easing: "ease-out"});
    return;
  }
  stl() {
    return super.stl() + require('./pageOptionElement.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./pageOptionElement.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./pageOptionElement.light.css').toString();
  }
}
window.customElements.define('c-page-options-element', PageOptionsElement);
