import Panel from "./../panel";
import Window from "./../../../_window/window";

export default abstract class WindowPanel extends Panel {
  private container: HTMLElement;
  constructor(window?: any) {
    super();
    this.container = ce("window-panel-container");
    this.sra(this.container);
    if (window !== undefined) this.window = window;
  }

  protected set window(to: any) {
    this.container.inner = to;
  }
  protected get window(): any {
    return this.container.childs()[0];
  }

  protected activationCallback(active: boolean) {
    super.activationCallback(active)
  }

  stl() {
    return super.stl() + require('./windowPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./windowPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./windowPanel.light.css').toString();
  }
}
