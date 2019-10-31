import Element from "./../element";

export default abstract class Window extends Element {
  private _color: string = "gray";
  private _side: Array<"top" | "left" | "right" | "bottom"> = [];
  private _grayed: boolean = false;
  private _borderWidth: number;
  constructor(side?: "top" | "left" | "right" | "bottom" | Array<"top" | "left" | "right" | "bottom">, color: string = themeColor, borderWidth: number = 10, selectable?: boolean) {
    super(true, selectable);
    if (color !== undefined) this.color = color;
    if (side !== undefined) this.side = side;
    if (borderWidth !== undefined) this.borderWidth = borderWidth;
  }
  public set borderWidth(to: number) {
    this._borderWidth = to;
    this.setBorder(this._color);
  }
  public get borderWidth() {
    return this._borderWidth;
  }
  public set grayedOut(to: boolean) {
    this._grayed = to;
    if (to) this.setBorder("gray");
    else this.setBorder(this._color);
  }
  public get grayedOut(): boolean {
    return this._grayed;
  }
  public set border(to: {color: string, side: "top" | "left" | "right" | "bottom" | Array<"top" | "left" | "right" | "bottom">}) {
    this._side = [to.side].flat();
    this._color = to.color;
    this.renderBorder();
  }
  public set color(to: string) {
    this._color = to;
    this.renderBorder();
  }
  public set side(to: "top" | "left" | "right" | "bottom" | Array<"top" | "left" | "right" | "bottom">) {
    this._side = [to].flat();
    this.renderBorder();
  }
  public get color(): string {
    return this._color;
  }
  public get side(): "top" | "left" | "right" | "bottom" | Array<"top" | "left" | "right" | "bottom"> {
    return this._side;
  }
  private renderBorder() {
    if (!this._grayed) this.setBorder(this._color);
  }
  private setBorder(color: string) {
    this._side.forEach(e => {
      this.css("border-" + e, this._borderWidth + "px solid " + color);
    });
  }
  stl() {
    return require('./window.css').toString();
  }
  public dark(): string {
    return require('./window.dark.css').toString();
  }
  public light(): string {
    return require('./window.light.css').toString();
  }
}
