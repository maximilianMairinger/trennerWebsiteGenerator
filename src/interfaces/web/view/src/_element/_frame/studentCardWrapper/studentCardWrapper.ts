import Frame from "./../frame";
import StudentCard, { cardInAnimation } from "../../_studentCard/interactAbleStudentCard/interactAbleStudentCard";
import { DataBase, DataArray } from "front-db";
import { Subject, Student } from "../../../lib/unitData/unitData";
import {Tel} from "extended-dom";

const animOptions = {duration: 500};


//When overflowing-y because of too many cards leave 60px padding bottom in order to be visable through studentCardIndecator
const neededPadding = 50;

export default class StudentCardWrapper extends Frame {
  private wrapper: HTMLElement = ce("card-wrapper");
  private container: HTMLElement = ce("card-container");

  private endls: Tel;
  private blurls: Tel;
  private enterls: Tel;

  private anyThingInAnimtion: Promise<any> = Promise.resolve();


  constructor(subject: DataBase<Subject>, students: DataArray<Student[]>, studentChangeSubject: (from: {name: string, klasse: string, subject: string}, to: {name: string, klasse: string, subject: string}, dropIndex: number) => void) {
    super();

    this.tabIndex = -1;

    let enterls = () => {
      if (isFlexed) {
        //if here were anything time dependent (an animation) this promise would be crutial since no animation reguarding the cards can be started without everything absolute
        this.anyThingInAnimtion = new Promise(async (res) => {
          isFlexed = false;
          reqRdy = true;
          dropRdy = false;

          let cards = this.container.childs();
          await this.alignContainer(true);
          this.container.height = this.container.height;

          let offsets = [];
          cards.ea((e) => {
            offsets.add(e.offset);
          })
          cards.ea((e, i) => {
            e.css("position", "absolute");
            e.css(offsets[i])
          })

          res();
        })
      }
    }

    this.enterls = new Tel([window, this, this.container], "dragenter", enterls, false)

    let isFlexed = true;
    let flexPos = async () => {
      if (!isFlexed) {
        isFlexed = true;
        let cards = this.container.childs();
        //@ts-ignore
        this.container.height = "";
        cards.ea((e) => {
          e.css({position: "", width: "", height: "", top: "", left: ""})
        })
        await this.alignContainer();
        this.container.css({margin: ""})
        this.onResize();
      }
    };


    let reqRdy = true;
    let dropRdy = false;
    let requestFixPos = async (s: "req" | "drop", to: boolean) => {
      if (s === "req") reqRdy = to;
      else if (s === "drop") dropRdy = to;
      if (reqRdy && dropRdy) {
        flexPos();
      }
    }



    let dragEnd = async (e) => {
      await this.anyThingInAnimtion;
      requestFixPos("drop", true);
    }
    this.endls = window.ls("dragend", dragEnd, false)
    this.blurls = this.ls("blur", dragEnd, false);



    let hoverToNext = async (newCard: HTMLElement, refCard: HTMLElement) => {


      let cards = this.container.childs<StudentCard>();

      let prevSibIndex: number;
      let nextSibIndex: number;
      let elemIndex: number;
      let passedBy = false;

      cards.ea((card, index) => {
        if (refCard === card) {
          elemIndex = index;
          passedBy = true;
        }
        else if (card.name === "") {
          if (!passedBy) prevSibIndex = index;
          else if (nextSibIndex === undefined) nextSibIndex = index;
        }
      });



      let incrementer: (i: number) => number;
      let matcher: (i: number) => boolean;


      let prevSibIsUndefined = prevSibIndex === undefined;

      //When not completely full
      //!(prevSibIsUndefined && nextSibIndex === undefined)
      if (true) {
        let insertBefore: boolean;
        let prefferedSiblingIndex: number;
        if (!prevSibIsUndefined || Math.abs(prevSibIndex - elemIndex) <= Math.abs(nextSibIndex - elemIndex)) {
          prefferedSiblingIndex = prevSibIndex || 0;
          incrementer = i => i-1;
          matcher = i => i >= prefferedSiblingIndex;
          insertBefore = false;
        }
        else {
          prefferedSiblingIndex = nextSibIndex || cards.length;
          incrementer = i => i+1;
          matcher = i => i < prefferedSiblingIndex;
          insertBefore = true;
        }

        let promises: Promise<any>[] = [];


        let stats;

        if (cards[prefferedSiblingIndex] !== undefined) {
          cards[prefferedSiblingIndex].agent = "none";
          promises.add(cards[prefferedSiblingIndex].anim({opacity: 0}, {duration: 400}).then(() => {
            cards[prefferedSiblingIndex].remove()
          }));
          stats = this.getLastRowStats();
        }
        else stats = this.getLastRowStats(1);


        for (let i = elemIndex; matcher(i); i = incrementer(i)) {
          let ip = incrementer(i);
          ip = (ip === -1) ? 0 : ip;
          if (prefferedSiblingIndex !== i) {
            let anim: Promise<any>;
            if (!stats.futureLastRowIndexes.includes(ip)) {
              let c = cards[ip]
              anim = cards[i].anim({left: c.offsetLeft, top: c.offsetTop, width: c.offsetTop, height: c.offsetHeight}, animOptions);
            }
            else {
              anim = cards[i].anim({
                width: stats.lastRowElementWidth,
                left: (ip - stats.futureCount + stats.lastRowCount) * stats.lastRowElementWidth,
                top: stats.lastRowElementTop
              }, animOptions);
            }
            promises.add(anim);
          }
        }



        if (insertBefore) this.container.insertBefore(newCard, refCard);
        else this.container.insertAfter(newCard, refCard);


        this.anyThingInAnimtion = Promise.all(promises);

        await this.anyThingInAnimtion;
      }
    };

    let getAnyThingInAnimation = () => {
      return this.anyThingInAnimtion;
    }

    let getColor = () => {
      return subject.get("color");
    }


    let addStudent = () => {
      let card = new StudentCard("dragAndDrop", subject.get("name"), {
        hoverToNext,
        getAnyThingInAnimation,
        requestFixPos,
        studentChangeSubject,
        getColor
      });
      this.container.apd(card);
      return card;
    }

    subject.get("maxStudents", async (max) => {
      this.container.emptyNodes();


      for (let i = 0; i < max; i++) {
        addStudent();
      }

      students.morph((student: DataBase<Student>, i) => {
        //TODO: set to first open slot
        if (student === null) return;
        let studentCard: StudentCard = (i < students.length()) ? this.container.childs<StudentCard>()[i] : addStudent();

        if (student.current("name") !== studentCard.name) {
          student.get(["name", "klasse"], (name: string, klasse: string) => {
            studentCard.setName(name);
            studentCard.setKlasse(klasse);
          })
          studentCard.setColorWithoutAnim(subject.get("color"));
        }
      }, true)
    })


    this.wrapper.apd(this.container)

    this.sra(this.wrapper);

  }
  private getLastRowStats(addToCount: number = 0) {
    let containerWidth = this.container.width;
    let cards = this.container.childs();
    let futureCount = cards.length + addToCount;
    let totalWidth = cards[0].width * futureCount;
    let rows = Math.ceil(+(totalWidth / containerWidth).toFixed(1));


    let columns = Math.ceil(futureCount / rows);

    let lastRowCount = columns - ((columns * rows) - futureCount);

    let lastRowElementWidth = containerWidth / lastRowCount;

    let lastRowElementTop = (lastRowCount === 1 && addToCount !== 0) ? cards.last.offsetTop + cards.last.height : cards.last.offsetTop;

    let futureLastRowIndexes = [];
    for (let i = futureCount - lastRowCount; i < futureCount; i++) {
      futureLastRowIndexes.add(i);
    }


    return {lastRowElementWidth, lastRowCount, lastRowElementTop, futureLastRowIndexes, futureCount}
  }

  protected activationCallback(active: boolean): void {
    if (active) {
      this.onResize();

      this.endls.enable();
      this.blurls.enable();
      this.enterls.enable();
    }
    else {
      this.endls.disable();
      this.blurls.disable();
      this.enterls.disable();
    }
  }
  private async alignContainer(instant = false) {
    let margin = (this.wrapper.height - (this.container.height + this.container.css("paddingBottom"))) / 2;
    await cardInAnimation.val;
    if (margin > 0) {
      if (instant) {
        this.container.css({marginBottom: margin, marginTop: margin});
      }
      else {
        await this.container.anim({marginBottom: margin, marginTop: margin}, {duration: 200});
      }
    }
  }
  onResize() {
    if (this.active) {
      //When overflowing-y because of too many cards leave 50px padding bottom in order to be visable through studentCardIndecator
      let {offsetTop: top, offsetHeight: height} = this.container.childs().last;
      if (top + height + neededPadding > this.height) {
        this.container.css({paddingBottom: neededPadding});
      }
      else {
        this.container.css({paddingBottom: 0});
      }
    }
  }
  stl() {
    return require('./studentCardWrapper.css').toString();
  }

  public dark(): string {
    return require('./studentCardWrapper.dark.css').toString();
  }
  public light(): string {
    return require('./studentCardWrapper.light.css').toString();
  }
}

window.customElements.define('c-student-card-wrapper', StudentCardWrapper);
