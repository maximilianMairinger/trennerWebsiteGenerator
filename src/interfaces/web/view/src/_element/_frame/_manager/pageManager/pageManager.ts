import Manager from "./../manager";
import Page from "./../../_page/page";
import delay from "./../../../../lib/delay/delay";
import Notification from "./../../../notification/notification";
import {setWeek} from "../../../../lib/weekData/weekData";
import lazyLoad, {ImportanceMap, Import} from "./../../../../lib/lazyLoad/lazyLoad";
import {post} from "../../../../lib/ajax/ajax";
import Notifier from "./../../../../lib/notifier/notifier";
import {switchToTheme} from "../../../element";
import {setLang} from "../../../../lib/language/language";
import {setAvatar, setUsername} from "../../../../lib/userData/userData";
import {setUnit} from "../../../../lib/unitData/unitData";
import TeacherPage from "../../_page/_panelPage/teacherPage/teacherPage";

function encode(s: string, k: number = 1337) {
  let enc = "";
  for (let i = 0; i < s.length; i++) {
    let a = s.charCodeAt(i);
    let b = a ^ k;
    enc = enc + String.fromCharCode(b);
  }
  return enc;
}


export default class PageManager extends Manager {
  protected currentFrame: Page;

  private currentPageName: "login" | "student" | "teacher";
  private nextPageName: "login" | "student" | "teacher";

  private pages: Map<string, Promise<any>>;

  constructor() {
    super();

    this.activate();


    const auth = async (authResult: any, isInitalLoginReq: boolean, username?: string) => {
      if (authResult.err) {
        this.page = "login";
      } else {
        switchToTheme(authResult.theme, false);
        setLang(authResult.language);
        setUsername(username || localStorage.username);
        if (authResult.photo === undefined)
          setAvatar(localStorage.avatar);
        else
          setAvatar(authResult.photo);
        if (authResult.class === "lehrer") {
          this.page = "teacher";

          if (await setUnit((isInitalLoginReq) ? authResult.session_key : localStorage.sessKey) === "NO_DATA_FOR_DAY") {
            this.pages.get("teacher").then((page: TeacherPage) => {
              page.setPanel("noLBS");
            })
          }
        } else {
          this.page = "student";
          setWeek((isInitalLoginReq) ? authResult.session_key : localStorage.sessKey);
        }
      }
    };

    const impMap = new ImportanceMap<() => Promise<object>>(
      {
        key: new Import<string>("login", 1, (Login) => {
          return new Login(async (username: string, password: string) => {
            let authRes = await post("login", {body: {username: encode(username), password: encode(password)}});
            if (authRes.err === "LOGIN_FAILED") Notifier.error(authRes.err);
            auth(authRes, true, username);

            if (!authRes.err) {
              let isItLoadedYet = false;
              let holdOnNoti: Notification;
              delay(1).then(() => {
                if (!isItLoadedYet) holdOnNoti = Notifier.log(true, "not_loaded");
              });


              this.pages.get(authRes.class === "lehrer" ? "teacher" : "student").then(() => {
                isItLoadedYet = true;
                if (holdOnNoti !== undefined) holdOnNoti.close();
              });

              this.pages.get("login").then((login) => {
                login.clearPw();
              })
            }
          });
        }), val: () => {
          return import(/* webpackChunkName: "loginPage" */"./../../_page/loginPage/loginPage")
        }
      },
      {
        key: new Import<string>("student", (localStorage.lastPage === "teacher") ? Infinity : 2, (Student) => {
          return new Student("overview", () => {
            this.page = "login";
          });
        }), val: () => {
          return import(/* webpackChunkName: "studentPage" */"./../../_page/_panelPage/studentPage/studentPage")
        }
      },
      {
        key: new Import<string>("teacher", (localStorage.lastPage === "student") ? Infinity : 2, (Teacher) => {
          return new Teacher(() => {
            this.page = "login";
          });
        }), val: () => {
          return import(/* webpackChunkName: "teacherPage" */"./../../_page/_panelPage/teacherPage/teacherPage")
        }
      }
    );

    const load = lazyLoad(impMap, e => {
      this.body.apd(e)
    });

    this.pages = load(localStorage.lastPage || "login");

    (async () => {
      let res = await post("getLoginData");

      if (res === undefined || res.err) {
        this.pages = load("login");
      }
      auth(res, false)
    })();
  }

  public set page(to: "login" | "student" | "teacher") {
    localStorage.lastPage = to;
    this.nextPageName = to;
    this.pages.get(to).then((mod) => {
      if (to === this.nextPageName) {
        this.setPage(mod);
        this.currentPageName = to;
      }
    });
  }

  public get page(): "login" | "student" | "teacher" {
    return this.currentPageName;
  }

  private setPage(to) {
    this.swapFrame(to);
  }

  stl() {
    return super.stl() + require('./pageManager.css').toString();
  }

  public dark(): string {
    return super.dark() + require('./pageManager.dark.css').toString();
  }

  public light(): string {
    return super.light() + require('./pageManager.light.css').toString();
  }

  protected async activationCallback(active: boolean) {
    super.activationCallback(active);
  }
}

window.customElements.define('c-page-manager', PageManager);
