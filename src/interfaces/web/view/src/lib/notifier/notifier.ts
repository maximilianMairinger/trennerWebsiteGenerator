import Notification from "./../../_element/notification/notification";
import NotificationQueue from "./../../_element/notificationQueue/notificationQueue";
import delay from "../delay/delay";
import lang from "../language/language";
import { combineStrings } from "../util/util";


function fc(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default class Notifier {
  public static queue = new NotificationQueue();

  /**
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}
   */
  public static log(text: string, options?: NotifierOptions): Notification;
  /**
   * @param title displayed title.
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}
   */
  public static log(title: string, text: string, options?: NotifierOptions): Notification;
  /**
   * @param defaultTitle true if the default title should be used.
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}
   */
  public static log(defaultTitle: boolean, text: string, options?: NotifierOptions): Notification;
  public static log(): Notification {
    //@ts-ignore
    return this.msg("information", ...arguments)
  }


  /**
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}
   */
  public static error(text: string, options?: NotifierOptions): Notification;
  /**
   * @param title displayed title.
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}
   */
  public static error(title: string, text: string, options?: NotifierOptions): Notification;
  /**
   * @param defaultTitle true if the default title should be used.
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}
   */
  public static error(defaultTitle: boolean, text: string, options?: NotifierOptions): Notification;
  public static error(): Notification {
    //@ts-ignore
    return this.msg("error", ...arguments)
  }


  /**
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}   */
  public static success(text: string, options?: NotifierOptions): Notification;
  /**
   * @param title displayed title.
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}   */
  public static success(title: string, text: string, options?: NotifierOptions): Notification;
  /**
   * @param defaultTitle true if the default title should be used.
   * @param text displayed message.
   * @param options {dontServeViaLang: True when text shall be interpreted with lang (defaults to true), closeAfter: Close after milliseconds; when Infinity or negative notifictaion never closes (defaults to 400)}   */
  public static success(defaultTitle: boolean, text: string, options?: NotifierOptions): Notification;
  public static success(): Notification {
    //@ts-ignore
    return this.msg("success", ...arguments)
  }
  //TODO:
  // warn

  public static msg(type: "information" | "success" | "error", text: string, options?: NotifierOptions): Notification;
  public static msg(type: "information" | "success" | "error", title: string, text: string, options?: NotifierOptions): Notification;
  public static msg(type: "information" | "success" | "error", defaultTitle: boolean, text: string, options?: NotifierOptions): Notification;
  public static msg(type: "information" | "success" | "error", title_text_defaultTitle: string | boolean, text_options: string | NotifierOptions = {}, options: NotifierOptions = {}): Notification {
    let closeTime: number = 4000;
    let cb1 = (p) => {
      this.queue.closeNotification(p)
    }
    let cb2 = () => {
      this.queue.closeAllNotifications()
    }
    let noti: Notification;

    if (typeof title_text_defaultTitle === "string" && typeof text_options === "object") {
      if (text_options.closeAfter !== undefined) closeTime = text_options.closeAfter;
      noti = new Notification("<pre> </pre>", undefined, type, cb1, cb2);
      if (text_options.dontServeViaLang) {
        noti.heading = title_text_defaultTitle;
      }
      else {
        lang(title_text_defaultTitle, (...heading) => {
          noti.heading = combineStrings(heading);
        });
      }
    }
    else if (typeof title_text_defaultTitle === "string" && typeof text_options === "string") {
      if (options.closeAfter !== undefined) closeTime = options.closeAfter;
      noti = new Notification("<pre> </pre>", "<pre> </pre>", type, cb1, cb2);
      if (options.dontServeViaLang) {
        noti.heading = title_text_defaultTitle;
        noti.msg = text_options;
      }
      else {
        lang(title_text_defaultTitle, (...text) => {
          noti.heading = combineStrings(text);
        });
        lang(text_options, (...text) => {
          noti.msg = combineStrings(text);
        });
      }
    }
    else if (typeof title_text_defaultTitle === "boolean" && typeof text_options === "string") {
      if (options.closeAfter !== undefined) closeTime = options.closeAfter;
      noti = new Notification("<pre> </pre>", "<pre> </pre>", type, cb1, cb2);
      if (options.dontServeViaLang) {
        lang(type, (type) => {
          noti.heading = fc(type);
        })
        noti.msg = text_options;
      }
      else {
        lang(type, (type) => {
          noti.heading = fc(type);
        })
        lang(text_options, (...text) => {
          noti.msg = combineStrings(text);
        })
      }
    }

    this.queue.appendNotification(noti);

    if (closeTime > 0 && closeTime !== Infinity) delay(closeTime).then(() => {
      noti.close();
    });
    return noti;
  }
}

interface NotifierOptions {
  dontServeViaLang?: boolean;
  closeAfter?: number;
}
