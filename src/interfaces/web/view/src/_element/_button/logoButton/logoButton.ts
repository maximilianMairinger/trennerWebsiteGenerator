
import Button from './../button';

/**
 * Button that takes up half of the screen and has an image in the center.
 */

 /**
  * ----------------------------------------------------------
  * TODO: Bei gelegenheit die Border in CSS Klassen auslagern.
  * ----------------------------------------------------------
  */
export default class BiOptionButton extends Button {
  private imgCont: HTMLElement;
  private _img: string;

  constructor(img: string, buttonPressedCallback?: Function,) {
    super(buttonPressedCallback, true, true);
    this.blurOnMouseOut = true;
    this.imgCont = ce("bi-option-img-container");
    this._img = img;
    this.imgCont.css("background-image", this._img);

    this.sra(this.imgCont);
  }

  public set img(to: string) {
    this._img = to;
    this.imgCont.css("background-image" ,this._img);
  }

  stl() {
    return super.stl() + require('./logoButton.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./logoButton.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./logoButton.light.css').toString();
  }
}
window.customElements.define('c-bi-option-button', BiOptionButton);
