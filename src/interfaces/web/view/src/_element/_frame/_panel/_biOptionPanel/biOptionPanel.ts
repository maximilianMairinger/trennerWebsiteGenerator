import Panel from "./../panel";
import Btn from "../../../_button/logoButton/logoButton";

export default class BiOptionPanel extends Panel {
  protected domainName = "option";
  private leftButton: Btn;
  private righButton: Btn;

  private lbcb: Function;
  private rbcb: Function;
  constructor(left: {cb: Function, img: string}, right: {cb: Function, img: string}) {
    super();

    this.lbcb = left.cb;
    this.rbcb = right.cb;

    this.leftButton = new Btn(left.img, this.lbcb);
    this.righButton = new Btn(right.img, this.rbcb);

    this.sra(this.leftButton, this.righButton);
  }



  protected activationCallback(active: boolean) {
    super.activationCallback(active)
  }

  public setLeftButton(cb: Function, img: string) {
    this.leftButton.img = img;
    this.leftButton.removeActivationCallback(this.lbcb);
    this.lbcb = cb;
    this.leftButton.addActivationCallback(this.lbcb);
  }

  public setRightButton(cb: Function, img: string) {
    this.righButton.img = img;
    this.righButton.removeActivationCallback(this.rbcb);
    this.rbcb = cb;
    this.righButton.addActivationCallback(this.rbcb);
  }

  stl() {
    return super.stl() + require('./biOptionPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./biOptionPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./biOptionPanel.light.css').toString();
  }
}
window.customElements.define('c-bi-option-panel', BiOptionPanel);
