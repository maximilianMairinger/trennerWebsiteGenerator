import Element from './../element';
import SelElem from "./../_button/selectorElement/selectorElement"
import vp from "./../../lib/viewport/viewport";


export default class Selector extends Element {

    private body: HTMLElement;
    private _elements: Array<SelElem>

    private _isOpen: boolean = false;
    private _active: boolean;
    public margin: number = 15;

    public dontCloseOnBlur: boolean = false;

    private triedToAlign: number = 0;
    private openedOnSide: "top" | "bottom" | "left" | "right";

    private enabled: boolean = true;
    constructor(public side: "top" | "bottom" | "left" | "right", public aligned: "node" | "mouse", active:boolean = true) {
      super();

      this.body = dc("selector-body");
      this.tabIndex = -1;

      let blurF = () => {if (!this.dontCloseOnBlur) this.close();};
      window.addEventListener("blur", blurF);
      this.on("blur", blurF);

      this.on("keydown", (e) => {
        if (e.code === "Escape") {
          this.close();
        }
        if (this.open) {
          try {
            if (e.code === "ArrowRight") {
              e.preventDefault();
              this.focusedIndex = this.elements.length -1;
            }
            else if (e.code === "ArrowLeft") {
              e.preventDefault();
              this.focusedIndex = 0;
            }
            if (this.openedOnSide === "bottom") {
              if (e.code === "ArrowDown") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex + 1;
              }
              else if(e.code === "ArrowUp") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex - 1;
              }
            }
            else if (this.openedOnSide === "top") {
              if (e.code === "ArrowDown") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex - 1;
              }
              else if(e.code === "ArrowUp") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex + 1;
              }
            }
            else if (this.openedOnSide === "right") {
              if (e.code === "ArrowDown") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex + 1;
              }
              else if(e.code === "ArrowUp") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex - 1;
              }
            }
            else if (this.openedOnSide === "left") {
              if (e.code === "ArrowDown") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex - 1;
              }
              else if(e.code === "ArrowUp") {
                e.preventDefault();
                this.focusedIndex = this.focusedIndex + 1;
              }
            }
          }
          catch (e) {
            //just catching index out of bounds (which doesnt matter here since it just defaults to the last)
          }
        }
      });
      this.sra(this.body);

      this.active = active;


      //When mouse leaves selector no selElem should be selected any more
      this.on("mouseout", (e) => {
        if (e.target === this) this.focus();
      });
    }
    public get focusedIndex(): number {
      let index: number = -1;
      this.elements.forEach((e: SelElem, i) => {
        if (e.matches(":focus")) {
          index = i;
        }
      });
      return index;
    }
    public set focusedIndex(to: number) {
      if (to > -1 && to < this.elements.length) this.elements[to].focus();
      else throw "Invald index.";
    }
    public enable() {
      this.enabled = true;
    }
    public disable() {
      this.enabled = false;
    }
    public set active(to: boolean) {
      this._active = to;
      this.elements.forEach((e) => {
        e.active = to;
      });
    }
    public get active(): boolean {
      return this._active;
    }
    public set elements(to: Array<SelElem>) {
      this.body.emptyNodes();
      this._elements = new Array(...to);
      to.forEach((e: SelElem) => {
        e.addActivationCallback(() => {
          //Call close extra since blur could be disbaled
          this.close();
        });
        this.body.append(e);
      });
      //dont remove it is necessary (look at the setter)
      this.active = this.active;
    }
    public get elements(): Array<SelElem> {
      if (this._elements !== undefined) return this._elements;
      else return [];
    }
    public open(event: UIEvent, target?: HTMLElement) {
      if (!this.enabled) return;
      this.body.css({display: "block", opacity: 0});

      let side = this.sideInViewport(event, this.side, target);
      this.openedOnSide = side;

      if (this.active) this.focus();

      this.body.anim({opacity: 1, transform: "translateX(0) translateY(0)"}).then(() => {
        this._isOpen = true;
      });
    }
    public close() {
      if (!this.isOpen) return;

      let end = () => {
        this.body.hide();
        this._isOpen = false;
      }

      switch (this.openedOnSide) {
        case "top":
          this.body.anim(
            {opacity: 0, transform: "translateY(5px)"}
          ).then(end);
          break;
        case "bottom":
          this.body.anim(
            {opacity: 0, transform: "translateY(-5px)"}
          ).then(end);
          break;
        case "right":
          this.body.anim(
            {opacity: 0, transform: "translateX(-5px)"}
          ).then(end);
          break;
        case "left":
          this.body.anim(
            {opacity: 0, transform: "translateX(5px)"}
          ).then(end);
          break;
        default:
      }
    }
    public get isOpen() {
      return this._isOpen;
    }
    public toggle(event: UIEvent, target?: HTMLElement) {
      if (this.isOpen) this.close();
      else this.open(event, target);
    }
    private align(e: UIEvent, side: "top" | "bottom" | "right" | "left", target?: HTMLElement):void {

      //remove arrows
      this.body.removeClass("bottomArrow");
      this.body.removeClass("topArrow");
      this.body.removeClass("leftArrow");
      this.body.removeClass("rightArrow");

      //@ts-ignore
      let t: HTMLElement = target || e.target;
      if (this.aligned === "mouse" && e instanceof MouseEvent) {
        let offset = t.absoluteOffset;

        switch (side) {
          case "top":
            var x = + e.pageX - offset.left - this.body.width / 2;
            var y = - e.pageY + offset.top + this.body.height + this.margin;

            this.body.css("left", x - (t.offsetWidth - t.width));
            this.body.css("bottom", y - this.body.height + t.height);
            this.body.addClass("bottomArrow");
            break;
          case "bottom":
            var x = + e.pageX - offset.left - this.body.width / 2;
            var y = - e.pageY + offset.top - this.margin;

            this.body.css("left", x - (t.outerWidth - t.innerWidth));
            this.body.css("bottom", y - this.body.height + t.height);
            this.body.addClass("topArrow");
            break;
          case "right":
            var x = + e.pageX - offset.left + this.margin;
            var y = - e.pageY + offset.top + this.body.height / 2;

            this.body.css("left", x - (t.outerWidth - t.innerWidth));
            this.body.css("bottom", y - this.body.height + t.height);
            this.body.addClass("leftArrow");
            break;
          case "left":
            var x = + e.pageX - offset.left - this.body.width - this.margin;
            var y = - e.pageY + offset.top + this.body.height / 2;

            this.body.css("left", x - (t.outerWidth - t.innerWidth));
            this.body.css("bottom", y - this.body.height + t.height);
            this.body.addClass("rightArrow");
            break;
          default:
        }
      }
      else if (this.aligned === "node") {
        switch (side) {
          case "top":
            this.body.css("left", ((-this.body.width / 2) + t.width / 2));
            this.body.css("top", -this.margin - this.body.height - t.height);
            this.body.addClass("bottomArrow");
            break;
          case "bottom":
            this.body.css("left", ((-this.body.width / 2) + t.width / 2));
            this.body.css("top",  this.margin);
            this.body.addClass("topArrow");
            break;
          case "right":
            this.body.css("top", ((-this.body.height / 2) - t.height / 2));
            this.body.css("left", t.height + this.margin);
            this.body.addClass("leftArrow");
            break;
          case "left":
            this.body.css("top", ((-this.body.height / 2) - t.height / 2));
            this.body.css("left", - this.margin - this.body.width);
            this.body.addClass("rightArrow");
            break;
          default:
        }
      }
    }
    private sideInViewport(e: UIEvent, side: "top" | "bottom" | "right" | "left" = this.side, target?: HTMLElement): "top" | "bottom" | "right" | "left" {
      if (this.triedToAlign === 2) {
        console.warn("Unexpected Viewport. Cannot fit selector properly.")
        this.align(e, this.side);
        return this.side;
      }

      this.triedToAlign++;
      this.align(e, side, target);
      if (!vp(this.body)) {
        side = this.flipSide(side);
        this.align(e, side, target);
        if (!vp(this.body)) {
          side = this.sideInViewport(e, this.rotateSide(side));
        }
      }
      this.triedToAlign = 0;
      return side;
    }
    private rotateSide(side: "top" | "bottom" | "right" | "left" = this.side) {
      if (side === "top") return "left";
      else if (side === "left") return "bottom";
      else if (side === "bottom") return "right";
      else if (side === "right") return "top";
    }
    private flipSide(side: "top" | "bottom" | "right" | "left" = this.side) {
      if (side === "top") return "bottom";
      else if (side === "bottom") return "top";
      else if (side === "left") return "right";
      else if (side === "right") return "left";
    }
    stl() {
      return require('./selector.css').toString();
    }
    public dark(): string {
      return require('./selector.dark.css').toString();
    }
    public light(): string {
      return require('./selector.light.css').toString();
    }
  }
  window.customElements.define('c-selector', Selector);
