import delay from "../../../lib/delay/delay";
import StudentCard from "./../studentCard";
import { Tel } from "extended-dom";
import { Data } from "front-db";

interface Functionality {
  hoverToNext: (newCard: HTMLElement, refCard: HTMLElement) => void;
  requestFixPos: (s: "req" | "drop", to: boolean) => any;
  getAnyThingInAnimation: () => Promise<any>;
  getColor: () => Data<string>;
  studentChangeSubject: (from: {name: string, klasse: string, subject: string}, to: {name: string, klasse: string, subject: string}, dropIndex: number) => void;
}


export const cardInAnimation: {val: Promise<any>} = {val: Promise.resolve()}


let recentlyDroppedAnElement = false;

export default class InteractAbleStudentCard extends StudentCard {
  private _draggin = false;
  private _agent: "drop" | "drag" | "dragAndDrop" | "none";
  private dropHandler: Drop;
  private dragHandler: Drag;

  private eventHandler = ce("event-handler");


  public justHoveredOver = false;

  public inProgress = false;




  constructor(agent?: "none")
  constructor(agent: "drag", subject: Data<string>)
  constructor(agent: "drop" | "dragAndDrop", subject: Data<string>, funcs: Functionality)
  constructor(agent: "drop" | "drag" | "dragAndDrop" | "none" = "none", public subject?: Data<string>, public funcs?: Functionality) {
    super();


    //This element is added so that there are no edges between elements filling up this. Those edges cause small interuptions in drop capabilities
    this.body.apd(this.eventHandler);


    this.on("dragstart", () => {this._draggin = true})
    this.on("dragend", () => {this._draggin = false})
    window.addEventListener("blur", () => {this._draggin = false})

    //this.agent = agent;
  }
  public set agent(to: "drop" | "drag" | "dragAndDrop" | "none") {
    this._agent = to;

    if (to !== "none") {
      if (this.dropHandler === undefined) {
        this.dragHandler = new Drag(this);
        this.dropHandler = new Drop(this);
      }

      if (to === "drop") {
        this.dropHandler.enable();
        this.dragHandler.disable();
      }
      else if (to === "drag") {
        this.dragHandler.enable();
        this.dropHandler.disable();
      }
      else if (to === "dragAndDrop") {
        this.dropHandler.enable();
        this.dragHandler.enable();
      }

    }
    else {
      if (this.dragHandler) {
        this.dragHandler.disable();
        this.dropHandler.disable();
      }
    }
  }
  public get agent() {
    return this._agent;
  }

  public get draggin() {
    return this._draggin;
  }

  stl() {
    return super.stl() + require('./interactAbleStudentCard.css').toString();
  }

  public dark(): string {
    return super.dark() + require('./interactAbleStudentCard.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./interactAbleStudentCard.light.css').toString();
  }
}

class TelCollections extends Array<Tel> {
  constructor() {
    super()
  }
  enable() {
    this.ea((e) => {
      e.enable();
    })
  }
  disable() {
    this.ea((e) => {
      e.disable();
    })
  }
  addListener(card: StudentCard, o: any) {
    for (let key in o) {
      //@ts-ignore
      this.add(card.ls(key, o[key].bind(this), false))
    }
  }
}

class Drop extends TelCollections {
  private dragInto = false;
  private rdyForDrop: Promise<any> = Promise.resolve();
  private dropAble = true;
  constructor(public card: InteractAbleStudentCard) {
    super();
    this.addListener(card, {
      dragenter: this.enter,
      dragleave: this.leave,
      dragover: this.over,
      drop: this.drop
    })
  }
  // This is an attemt to fix a chrome bug where the browser doesnt recalculate the dropLayer
  // (the map from which is calculated which element should get the drop event) when an element
  // is animated away under the cursor. This may be removed in the future.
  private reflowDropLayer() {
    this.card.parent.offsetHeight;
  }
  public enter() {
    this.dragInto = true;


    if (!this.card.draggin && !this.card.justHoveredOver) {
      this.card.justHoveredOver = true;
      this.rdyForDrop = new Promise((res) => {
        delay(200).then(async () => {
          this.card.justHoveredOver = false
          if (this.dragInto) {
            if (this.card.name !== "") {
              this.card.funcs.requestFixPos("req", false);


              await this.card.funcs.getAnyThingInAnimation();

              let newCard = new InteractAbleStudentCard("dragAndDrop", this.card.subject, this.card.funcs);
              newCard.css({position: "absolute", width: this.card.width, left: this.card.css("left"), top: this.card.css("top")})

              await this.card.funcs.hoverToNext(newCard, this.card);
              this.reflowDropLayer();

              res(newCard)
              this.card.funcs.requestFixPos("req", true);
            }
          }
          res();
        })
      });
    }

    return this.rdyForDrop;
  }
  public leave() {
    this.dragInto = false;
  }
  public over(e) {
    if (this.dropAble) e.preventDefault();
  }
  public async drop(ev: DragEvent) {
    this.card.funcs.requestFixPos("req", false);


    let src = ev.getData();

    let from = {name: clone.name, klasse: clone.klasse, subject: src.subject.val};

    recentlyDroppedAnElement = true;
    delay(12, () => {
      recentlyDroppedAnElement = false;
    })

    let res: Function;
    cardInAnimation.val = new Promise(async (r) => {
      res = r;
    });

    let maybeTheCard = await this.rdyForDrop;
    let card: InteractAbleStudentCard = (maybeTheCard === undefined) ? this.card : maybeTheCard;


    this.dragInto = false;


    let {name, klasse, color} = clone;


    //since the absoluteOffset object is imutable or something it cant be destructed with the ... operator

    let absoluteOffset = cloneData(card.absoluteOffset)



    await clone.anim({marginLeft: 0, ...absoluteOffset})





    card.set(name, klasse, color);
    clone.hide();



    if (src !== card) src.name = "";

    res()

    this.card.funcs.requestFixPos("req", true);

    await Promise.all([
      delay(300, async () => {
        if (card.color !== "") {
          let color = this.card.funcs.getColor()
          if (card.color !== color.val) {
            card.setColor(color);
            this.card.funcs.studentChangeSubject(from, {name, klasse, subject: this.card.subject.val}, card.parent.childs().indexOf(card));
          }
        }
      }),
      src.anim({opacity: 1})
    ]);
  }
}

class Drag extends TelCollections {
  private grabOffset = {x: 0, y: 0};
  constructor(public card: InteractAbleStudentCard) {
    super();
    this.addListener(card, {
      dragstart: this.start,
      dragend: this.end,
      drag: this.move,
    })

    this.card.draggable = true;

  }

  start(e) {
    if (this.card.name !== "") {


      e.setData(this.card);
      e.dataTransfer.setDragImage(this.card, 999999, 999999);

      clone.set(this.card.name, this.card.klasse, this.card.color);


      this.card.set(" ", "", "")



      let offset = this.card.absoluteOffset;


      this.grabOffset.x = e.x - offset.left;
      this.grabOffset.y = e.y - offset.top;

      clone.css(offset);
      let firstElemWidth = this.card.parent.childs().first.width;

      let percentualGrabOffset = this.grabOffset.x / offset.width;
      clone.anim({width: firstElemWidth, marginLeft: this.grabOffset.x - (percentualGrabOffset * firstElemWidth)}, {duration: 300})


      this.move(e);

      clone.show();


      this.card.anim({opacity: .3})
    }
    else e.preventDefault();
  }
  async end(e) {

    if (!recentlyDroppedAnElement) {
      let offset = this.card.absoluteOffset;
      let anim: Promise<any>;
      if (offset.top !== 0) anim = clone.anim({marginLeft: 0, ...cloneData(this.card.absoluteOffset)}, {duration: 300});
      else anim = clone.anim({opacity: 0}).then(() => {
        clone.hide();
        clone.css("opacity", 1)
      })
      cardInAnimation.val = anim;
      await anim;
      this.card.set(clone.name, clone.klasse, clone.color)
      this.card.css("opacity", 1)
      clone.hide();
    }
  }
  move(e) {
    clone.css({
      top:  (e.y || mouse.y) - this.grabOffset.y,
      left: (e.x || mouse.x) - this.grabOffset.x,
    });
  }
}

window.customElements.define('c-interact-able-student-card', InteractAbleStudentCard);

const clone = new InteractAbleStudentCard()
clone.setAttribute("noteToAllTheDevelopers", "If_you_want_to_know_how_this_is_done,_visit_https://stackoverflow.com/a/56892589/10226440");
clone.css({position: "absolute", zIndex: 4, padding: 10, pointerEvents: "none"})
clone.hide();

document.body.append(clone)
