import Panel from "../panel";
import StudentCardWrapperManager from "../../../_frame/_manager/studentCardWrapperManager/studentCardWrapperManager";
import LessonSelector from "../../../lessonSelector/lessonSelector";
import { DataBase, DataArray } from "front-db";
import { Subject, LB } from "../../../../lib/unitData/unitData";
import delay from "../../../../lib/delay/delay";
import FinderBar from "../../../finderBar/finderBar";
import lang from "../../../../lib/language/language";


const animOptions = {duration: 300};

export default class ViewStudentsPanel extends Panel {
  protected domainName;

  private manager: StudentCardWrapperManager;
  private lessonSelector: LessonSelector;
  private searchBar: FinderBar;

  private subjects: DataArray<Subject[]>
  constructor(private lb: DataArray<LB>) {
    super();
    this.domainName = this.lb.current("name")

    this.subjects = lb.ref("subjects").asArray;
    this.manager = new StudentCardWrapperManager(this.subjects, this.setWrapper.bind(this));

    this.sra(this.manager)

    this.searchBar = new FinderBar(this.subjects, this.closeSearch.bind(this));

    this.sra(this.searchBar);




    this.lessonSelector = new LessonSelector(this.subjects, (to) => {
      this.manager.setWrapper(to);
    }, this.toggleSearch.bind(this));
    this.sra(this.lessonSelector);


    this.on("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.code === "KeyF") {
          e.preventDefault();
          this.toggleSearch();
          this.manager.recalculateSize();

        }
        else if (e.code === "KeyP") {
          this.manager.recalculateSize();
          e.preventDefault();
          this.toggleSearch();
        }
      }
    })


  }
  public searchOpen = false;
  public async openSearch() {
    if (!this.searchOpen) {
      this.searchOpen = true;
      this.searchBar.activateBar();

      await Promise.all([
        this.searchBar.anim({marginRight: 0}, animOptions),
        this.manager.anim({width: "calc(100% - 350px)"}, animOptions),
        this.lessonSelector.anim({width: "calc(100% - 350px)"}, animOptions),
        this.lessonSelector.setSearchMode(true),
        delay(100, () => {
          this.searchBar.focus();
        })
      ])

      this.manager.recalculateSize()
    }
  }
  public async closeSearch() {
    if (this.searchOpen) {
      this.searchOpen = false;

      this.lessonSelector.focusActive();

      await Promise.all([
        this.searchBar.anim({marginRight: -350}, animOptions).then(() => {
          this.searchBar.deactivateBar();
        }),
        this.manager.anim({width: "100%"}, animOptions),
        this.lessonSelector.anim({width: "100%"}, animOptions),
        this.lessonSelector.setSearchMode(false),
      ])

      this.manager.recalculateSize()

    }
  }
  public async toggleSearch() {
    if (this.searchOpen) await this.closeSearch();
    else await this.openSearch();
  }
  public async setWrapper(to: number | string) {
    if (typeof to === "string") {
      to = this.subjects.list((subject: DataBase<Subject>, i) => {
        if (subject.current("name") === to) {
          return i;
        }
      })
    }

    await this.manager.setWrapper(to),
    await this.lessonSelector.activateOption(to)
  }
  protected activationCallback(active: boolean): void {
    super.activationCallback(active)
    this.manager.vate(active);
  }
  stl() {
    return super.stl() + require('./viewStudentsPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./viewStudentsPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./viewStudentsPanel.light.css').toString();
  }
}

window.customElements.define('c-view-students-panel', ViewStudentsPanel);
