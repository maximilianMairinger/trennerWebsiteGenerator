import Manager from "./../manager";
import { Subject } from "../../../../lib/unitData/unitData";
import { DataBase, DataArray } from "front-db";
import StudentCardWrapper from "../../studentCardWrapper/studentCardWrapper";
import StudentCountIndicator from "../../../studentCountIndicator/studentCountIndicator";
import Frame from "../../frame";

export default class StudentCardWrapperManager extends Manager {
  protected domainIndex = 1;
  protected domainPush = true;

  protected currentFrame: Frame;
  private studentCardWrappers: StudentCardWrapper[] = [];
  private countIndicator: StudentCountIndicator = new StudentCountIndicator(0, 0);

  private _currentWrapperIndex: number;


  constructor(private subjects: DataArray<Subject[]>, setWrapper: (subject: string) => {}, blurCallback?: Function) {
    super(blurCallback);

    let studentChangeSubject = (from: {name: string, klasse: string, subject: string}, to: {name: string, klasse: string, subject: string}, dropIndex: number) => {

      subjects.list((subject: DataBase<Subject>) => {
        let students = subject.peek("students").asArray;
        if (subject.current("name") === to.subject) {
          students.add({name: to.name, klasse: to.klasse}, dropIndex);
          this.updateCount(subject);
        }
        if (subject.current("name") === from.subject) students.removeV({name: from.name, klasse: from.klasse}, true);
      })
    }

    (async () => {
      await subjects.forEach((subject: DataBase<Subject>) => {
        this.studentCardWrappers.add(new StudentCardWrapper(subject, subject.ref("students").asArray, studentChangeSubject));
      }, () => {
        this.studentCardWrappers.clear();
      }, () => {
        this.body.apd(...this.studentCardWrappers);
      });

      this.sra(this.countIndicator);
      this.parseDomain(1, 0, setWrapper)
    })()
  }
  public recalculateSize() {
    //@ts-ignore
    this.currentFrame.onResize();
  }
  public async setWrapper(to: number) {
    if (this._currentWrapperIndex !== to) {
      this._currentWrapperIndex = to;
      this.swapFrame(this.studentCardWrappers[to]);

      let subject: DataBase<Subject> = this.subjects.ref(to);

      this.domainName = subject.current("name")
      this.countIndicator.setColor(subject.current("color"));
      this.countIndicator.setMaxStudentCount(subject.current("maxStudents"));
      this.updateCount(subject);
    }
  }
  public updateCount(subject: DataBase<Subject>) {
    this.countIndicator.setStudentCount(subject.ref("students").asArray.realLength())
  }
  public getWrapper(): number {
    return this._currentWrapperIndex;
  }
  protected async activationCallback(active: boolean) {
    super.activationCallback(active);
  }
  stl() {
    return super.stl() + require('./studentCardWrapperManager.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./studentCardWrapperManager.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./studentCardWrapperManager.light.css').toString();
  }
}

window.customElements.define('c-student-card-wrapper-manager', StudentCardWrapperManager);
