import Element from "../element";

export default abstract class Indecator extends Element {
  private container: HTMLElement = ce("indecator-container");
  private ongoingAnimation;
  constructor() {
    super();
    this.sra(this.container);
  }
  protected async indecate(elem: HTMLElement | string) {
    if (this.ongoingAnimation !== undefined) await this.ongoingAnimation
    this.container.inner = elem
  }
  protected async removeIndecation() {
    if (this.ongoingAnimation !== undefined) await this.ongoingAnimation
    let elem = this.container.childs().first
    this.ongoingAnimation = elem.anim({opacity: 0})
    await this.ongoingAnimation
    elem.remove()
    this.ongoingAnimation = undefined
  }
  stl() {
    return require('./indecator.css').toString();
  }
  public dark(): string {
    return require('./indecator.dark.css').toString();
  }
  public light(): string {
    return require('./indecator.light.css').toString();
  }
}
