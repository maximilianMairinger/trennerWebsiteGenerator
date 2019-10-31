import Element from "./../element";



export default class StudentCountIndicator extends Element {
  private colorContainer: HTMLElement = ce("color-container");
  private studentCount: HTMLElement = ce("student-count");
  private maxStudentCount: HTMLElement = ce("max-student-count");
  private textContainer: HTMLElement = ce("text-container");

  private sc: number;
  private msc: number;
  constructor(studentCount: number = 0, maxStudentCount: number = 20, color: string = "transparent") {
    super(true, false);

    let countSplit = ce("count-split").apd("/");
    this.textContainer.apd(this.studentCount, countSplit, this.maxStudentCount);
    this.colorContainer.apd(this.textContainer);
    this.sra(this.colorContainer);

    this.sc = studentCount
    this.msc = maxStudentCount;
    this.setColor(color);

    //We dont want any animation initally (hence we cant use setter)
    this.studentCount.inner = this.sc;
    this.maxStudentCount.inner = this.msc;
    this.colorContainer.css({width: this.calculateWidth() + "%"});
  }

  public setColor(color: string) {
    this.colorContainer.css({backgroundColor: color})
  }

  public setMaxStudentCount(maxStudentCount: number) {
    if (maxStudentCount < 0) throw "Count must be bigger than -1";
    this.msc = maxStudentCount;
    this.updateAll()
  }

  public setStudentCount(studentCount: number) {
    if (studentCount < 0) throw "Count must be bigger than -1";
    this.sc = studentCount;
    this.updateAll();
  }

  private updateAll() {
    this.updateLabels();
    this.updateWidth();
  }

  private async updateLabels() {
    //@ts-ignore
    if (this.studentCount.html != this.sc) {
      await this.textContainer.anim({opacity: 0});
      this.studentCount.inner = this.sc;
      this.maxStudentCount.inner = this.msc;
      if (this.sc !== 0) await this.textContainer.anim({opacity: 1});
    }
  }

  private calculateWidth() {
    return (this.msc === 0) ? 0 : (this.sc / this.msc) * 100;
  }
  private async updateWidth() {
    await this.colorContainer.css({width: this.calculateWidth() + "%"});
  }

  stl() {
    return require('./studentCountIndicator.css').toString();
  }

  public dark(): string {
    return require('./studentCountIndicator.dark.css').toString();
  }
  public light(): string {
    return require('./studentCountIndicator.light.css').toString();
  }
}

window.customElements.define('c-student-count-indicator', StudentCountIndicator);
