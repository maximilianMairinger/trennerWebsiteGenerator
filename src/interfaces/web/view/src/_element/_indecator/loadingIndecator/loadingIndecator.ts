import Indecator from "../indecator";

export default class LoadingIndecator extends Indecator {
  constructor(start: boolean = true, public dimension?: {width: number, height: number}) {
    super();
    if (start) this.start();
  }
  public start() {
    let loader = ce("loading-element")
    if (this.dimension !== undefined) {
      loader.css(this.dimension);
      loader.css({width: 123, height: 32})
      /**                                                                        (7.5 * 2) */
      loader.css("borderWidth", (this.dimension.width + this.dimension.height) / (15));
    }
    this.indecate(loader)
    loader.anim([
      {transform: "rotate(0deg)"},
      {transform: "rotate(360deg)"}
    ],
    {iterations: Infinity, duration: 1000, easing: "linear", fill: false})
  }
  public async stop() {
    this.removeIndecation()
  }
  stl() {
    return super.stl() + require('./loadingIndecator.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./loadingIndecator.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./loadingIndecator.light.css').toString();
  }
}

window.customElements.define('c-loading-indecator', LoadingIndecator);
