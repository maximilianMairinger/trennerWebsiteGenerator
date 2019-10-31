import Button from "./../button";

export default class SwitchableHeading extends Button {
  private leftConatiner: HTMLElement;
  private rightConatiner: HTMLElement;
  private isLeft: boolean;


  constructor(text?: {right: string, left: string}, private startingPosition: "left" | "right" = "left", public callback?: Function) {
    super((e) => {
      this.switch();
      if(this.callback !== undefined) this.callback(this.isLeft);
    });
    this.rightConatiner = dc("switchableHeading-container");
    this.leftConatiner = dc("switchableHeading-container");

    this.leftConatiner.apd(dc("span"));

    var img = dc("c-img");
    img.css("transform", "rotate(-90deg)");
    this.leftConatiner.apd(img);

    var img = dc("c-img");
    img.css("transform", "rotate(90deg)");
    this.rightConatiner.apd(img);

    this.rightConatiner.apd(dc("span"));

    this.sra(this.rightConatiner, this.leftConatiner);

    if (text) this.text = text;
    this.callback = callback;

    this.on("keydown", (e) => {
      if (e.code === "ArrowLeft") this.aligne("left");
      else if (e.code === "ArrowRight") this.aligne("right");
      else return;
      if(this.callback !== undefined) this.callback(this.isLeft);
    });

    this.addConnectedCallback(() => {
      this.aligne(this.startingPosition);
    });
  }
  public set text(to: {right: string, left: string}) {
    this.rightText = to.right;
    this.leftText = to.left;
  }
  public get text(): {right: string, left: string} {
    return {right: this.rightText, left: this.leftText};
  }
  public set rightText(to: string) {
    this.rightConatiner.childs("span").html = to;
  }
  public set leftText(to: string) {
    this.leftConatiner.childs("span").html = to;
  }
  public get leftText(): string {
    return this.leftConatiner.childs("span").html;
  }
  public get rightText(): string {
    return this.rightConatiner.childs("span").html;
  }
  public aligne(left_direction: boolean | "left" | "right") {
    let left:boolean;
    if (typeof left_direction === "string") left = left_direction === "left";
    else left = left_direction;

    let s1 = {opacity: "1", transform: "translateX(5px)"};
    let s2 = {opacity: "0", transform: "translateX(-5px)"};

    let param = {duration: 150};

    if (left && (!this.isLeft || this.isLeft === undefined)) {
      this.leftConatiner.anim(s1,param);
      this.rightConatiner.anim(s2,param);
    }
    if (!left && (this.isLeft || this.isLeft === undefined)) {
      this.rightConatiner.anim(s1,param);
      this.leftConatiner.anim(s2,param);
    }
    this.isLeft = left;
  }
  public switch() {
    this.aligne(!this.isLeft);
  }
  stl() {
    return super.stl() + require('./switchableHeading.css').toString()
  }
  public dark(): string {
    return super.dark() + require('./switchableHeading.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./switchableHeading.light.css').toString();
  }
}

window.customElements.define('c-switchable-heading', SwitchableHeading);
