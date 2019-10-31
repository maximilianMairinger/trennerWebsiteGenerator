import Frame from "./../frame";

export default abstract class Page extends Frame {
  protected domainIndex = 0;
  protected domainPush = false;
  constructor() {
    super();
  }
  stl() {
    return super.stl() + require('./page.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./page.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./page.light.css').toString();
  }
  protected activationCallback(active: boolean) {

  }
}
