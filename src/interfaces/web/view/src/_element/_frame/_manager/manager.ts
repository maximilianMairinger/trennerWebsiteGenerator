import Frame from "./../frame";
import LoadingIndecator from "../../_indecator/loadingIndecator/loadingIndecator";
import { domainIndex as domains } from "../../../lib/domain/domain";

export class UnknownFrameException extends Error {
  constructor() {
    super("Frame is unknown.")
  }
}

export default abstract class Manager extends Frame {
  private resFirstFrameSet: Function;
  private firstFrameSet: Promise<any>;

  protected busySwaping: boolean = false;
  protected abstract currentFrame: Frame;

  protected body: HTMLElement;

  private wantedFrame: Frame;

  private loadingElem: LoadingIndecator;
  constructor(public blurCallback?: Function) {
    super();
    this.firstFrameSet = new Promise((res) => {
      this.resFirstFrameSet = res;
    })

    this.body = dc("manager-body");
    this.loadingElem = new LoadingIndecator();
    this.body.inner = this.loadingElem;
    this.sra(this.body);

    this.on("keydown", (e) => {
      if (e.code === "Escape") {
        this.blur();
        if (this.blurCallback !== undefined) this.blurCallback(e);
      }
    });
  }
  /**
   * Swaps to given Frame
   * @param to frame to be swaped to
   */
  protected swapFrame(to: Frame): void {
    if (to === undefined) throw new UnknownFrameException();

    this.loadingElem.remove();

    this.wantedFrame = to;
    let from = this.currentFrame;
    if (this.busySwaping) return;
    this.busySwaping = true;
    //Focus even when it is already the active frame
    to.focus();
    if (from === to) {
      this.busySwaping = false;
      return;
    }
    to.show();
    to.focus();

    if (this.active) to.activate();
    let showAnim = to.anim({opacity: 1});
    let finalFunction = () => {
      this.busySwaping = false;
      if (this.wantedFrame !== to) this.swapFrame(this.wantedFrame);
    }

    this.currentFrame = to;
    this.resFirstFrameSet();

    if (from === undefined) {
      showAnim.then(finalFunction);
    }
    else {
      from.deactivate();
      Promise.all([
        from.anim({opacity: 0}).then(() => {
          from.hide();
        }),
        showAnim
      ]).then(finalFunction);

    }
  }
  protected async parseDomain(domainIndex: number, _default: string | number, swapFrameCaller: (subDomain: string | number) => void) {
    let domain = domains[domainIndex];
    if (domain !== undefined) {
      try {
        await swapFrameCaller(domain)
      }
      catch(e) {
        if (e instanceof UnknownFrameException) await swapFrameCaller(_default)
        else throw e;
      }
    }
    else await swapFrameCaller(_default)
  }
  protected async activationCallback(active: boolean) {
    await this.firstFrameSet;
    //@ts-ignore
    if (this.currentFrame.active !== active)
      this.currentFrame.vate(active);
  }
  stl() {
    return super.stl() + require('./manager.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./manager.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./manager.light.css').toString();
  }
}
