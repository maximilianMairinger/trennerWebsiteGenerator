import Element from "./../element";
import Notification from "../notification/notification";

export default class NotificationQueue extends Element {

  private boxList: Array<Notification>;
  constructor() {
    super();
    this.boxList = [];
  }

  public appendNotification(noti: Notification): Notification {
    this.boxList.push(noti);
    if(this.boxList.length > 1) {
        if(!this.boxList[0].hasCloseAll()) {
          this.boxList[0].addCloseAllOption();
        }
    }
    this.sra(noti);
    noti.anim({transform: "rotateX(0) translate(0, 0)", opacity: 1}, {duration: 160, easing: "cubic-bezier(0.175, 0.885, 0.32, 1.27499)"});
    return noti;
  }

  public closeNotification(notification_index: Notification | number): Promise<boolean> {
    return new Promise(async (res, rej) => {
      let toBeRem:Notification;
      if (typeof notification_index === "number") toBeRem = this.boxList[notification_index];
      else toBeRem = notification_index;
      if (toBeRem === undefined) return rej();
      if (toBeRem.closing) return res(false);
      toBeRem.closing = true;

      await toBeRem.anim({opacity: 0, transform: "scale(.8)"}, {duration: 120, easing: "cubic-bezier(.34,.07,1,.2)"});
      this.positionClearAllButton();
      await toBeRem.anim({height: 0, marginTop: 0, marginBottom: 0}, {duration: 240, easing: "cubic-bezier(0.5, 0, 0, 1)"});
      this.boxList.removeV(toBeRem);
      toBeRem.remove();
      this.positionClearAllButton();
      res(true);
    });
  }

  public closeAllNotifications() {
    this.boxList.forEach((toBeRem) => {
      this.closeNotification(toBeRem);
    });
  }

  public lowerNotificationQueue(by: number) {
    this.anim({transform: "translateY(" + by + "px)"})
  }

  private positionClearAllButton() {
    if(this.boxList.length === 1) {
      if(this.boxList[0].hasCloseAll()) {
        this.boxList[0].removeCloseAllOption();
      }
    }
    else if(this.boxList.length > 1){
      if(!this.boxList[0].hasCloseAll()) {
        this.boxList[0].addCloseAllOption();
      }
    }
  }
  

    stl() {
      return require('./notificationQueue.css').toString();
  }
  public dark(): string {
    return require('./notificationQueue.dark.css').toString();
  }
  public light(): string {
    return require('./notificationQueue.light.css').toString();
  }
}

window.customElements.define('c-notification-queue', NotificationQueue);
