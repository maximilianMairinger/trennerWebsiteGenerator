import Frame from "./../frame";

export default abstract class Panel extends Frame {
  protected domainIndex = 0;
  protected domainPush = true;
  constructor() {
    super();
    this.tabIndex = -1;
  }
  stl() {
    return super.stl() + require('./panel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./panel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./panel.light.css').toString();
  }
  protected activationCallback(active: boolean) {
    
  }
}
