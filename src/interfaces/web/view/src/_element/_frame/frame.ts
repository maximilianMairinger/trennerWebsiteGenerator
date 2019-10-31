import Element from "./../element";
import { set } from "../../lib/domain/domain";
import { Data } from "front-db";

export default abstract class Frame extends Element {
  protected domainIndex: number;
  protected domainPush: boolean;
  private _domainName: string;

  protected active: boolean = false;
  constructor() {
    super();
  }
  public activate(): void {
    this.vate(true)
  }
  public deactivate(): void {
    this.vate(false)
  }
  public vate(activate: boolean) {
    this.active = activate;
    if (activate) this.setDomain();
    this.activationCallback(activate);
  }
  protected set domainName(to: string) {
    this._domainName = to;
    if (this.active) this.setDomain()
  }
  protected get domainName() {
    return this._domainName;
  }
  private setDomain() {
    if (this.domainIndex === undefined || this.domainName === undefined) return;
    set(this.domainIndex, this.domainName, this.domainPush)
  }
  protected abstract activationCallback(active: boolean):void;
  public stl() {
    return require('./frame.css').toString();
  }
  public dark(): string {
    return require('./frame.dark.css').toString();
  }
  public light(): string {
    return require('./frame.light.css').toString();
  }
}
