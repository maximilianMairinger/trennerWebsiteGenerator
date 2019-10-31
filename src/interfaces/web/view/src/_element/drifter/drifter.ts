import Element from "./../element";
import delay from "./../../lib/delay/delay";


// NOTE: MUST HAVE
// DONE: Anzahl der elemente abhängig von größe (dynamisch upgedated)
// DONE: Framerate miteinbeziehen (geschwindigkeit resoltion multiplizieren mit abstand zu letztem frame)
// TODO: Retina shit idk

// NOTE: SHOULD HAVE
// DONE: collision detection + resolution

// NOTE: NICE TO HAVE
// TODO: spectal effects on collision



// MABE: Maybe a bottleneck falls der abstand zwishcen frames zu groß ist (-> der pc zu langsam) zu einem statischen bild wächseln (da muss man aber aufpassen da bei requestanimationFrame weniger frames gerendert werden wenn das fenster nicht gefocused ist)


//This is global becaus timestaps are calculated since pageload;
let prevTimestamp: number = 0;

//Code is not too clean but works
//may be rewritten when time has come
export default class Drifter extends Element {
  public color: string = themeColor;
  public relvx: number = .1;
  public relvy: number = .01;
  public minvx: number = .05;
  public minvy: number = .002;

  private intendedReticleAmount: number;
  private _reticleAmount: number = 0;
  private reticles: Array<Reticle> = [];
  private _running: boolean;
  private _reticleDensity: number;

  private resizeCounter: number = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(reticleDensity: number = 30720) {
    super();

    this.canvas = ce("canvas");
    this.canvas.css({width: "100%", height: "100%"})
    this.ctx = this.canvas.getContext("2d");

    this.sra(this.canvas);

    this.reticleDensity = reticleDensity;

    this.addDisconnectedCallback(() => {
      this._running = false;
    });
  }
  //dont call too early or else style calc wont work (must be rendered in the dom)
  public async start() {
    if (this.running) return;
    this._running = true;

    this.resize2(false);
    this.setRetDens(false);

    this.update();

    await this.canvas.anim({opacity: 1});
  }
  public stop() {
    this._running = false;
  }
  public get running(): boolean {
    return this._running;
  }
  onResize() {
    this.resize2(true);
  }
  public set reticleDensity(to: number) {
    this._reticleDensity = to;
    this.onResize();
  }
  public get reticleDensity(): number {
    return this._reticleDensity;
  }
  private resize2(appendElems: boolean) {
    if (this._running) {
      this.canvas.width = parseFloat(this.canvas.css("width"));
      this.canvas.height = parseFloat(this.canvas.css("height"));
      (async () => {
        this.resizeCounter++;
        let thisResize = this.resizeCounter;
        await delay(300);
        if (this.resizeCounter !== thisResize) return;
        if (appendElems) this.setRetDens(true);
      })()
    }
  }
  private setRetDens(appendLeft?: boolean) {
    this.setReticleAmount(Math.ceil((this.canvas.width * this.canvas.height) / this.reticleDensity), appendLeft);
  }
  private setReticleAmount(to: number, appendLeft: boolean = false) {
    this.intendedReticleAmount = to;
    for (let i = this.reticleAmount; i < to; i++) {
      let retic = this.baseReticle();
      if (!appendLeft) retic.pos[0] = Math.random() * this.canvas.width;
      this.reticles.add(retic);
      this._reticleAmount++;
    }
  }
  public get reticleAmount() {
    return this._reticleAmount;
  }
  private baseReticle(): Reticle {
    let size = Math.round(Math.random() * 20 + 10);
    let vx = Math.random() * this.relvx + this.minvx;
    let vy = (Math.random() * this.relvy + this.minvy) * minorplus();
    let posX = -size;
    let posY = this.canvas.height * Math.random();

    return new Reticle(vx, vy, posX, posY, size);
  }
  private update(timestamp = prevTimestamp) {
    if (this._running) requestAnimationFrame(this.update.bind(this));
    else {
      prevTimestamp = 0;
      return;
    }

    //dont translate in first frame after pause
    let frameDelta = (prevTimestamp !== 0) ? timestamp - prevTimestamp : 0;
    prevTimestamp = timestamp;


    this.run_model();
    this.run_collider();
    this.run_translate(frameDelta);
    this.run_draw();
  }
  private run_draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.reticles.forEach((e) => {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(e.pos[0], e.pos[1], e.size, e.size);
    });
  }
  private run_translate(frameDelta: number) {
    this.reticles.forEach((e) => {
      e.pos[0] += (e.vel[0] * frameDelta);
      e.pos[1] += (e.vel[1] * frameDelta);
    });
  }
  private run_model() {
    for (let i = 0; i < this.reticles.length; i++) {
      let e = this.reticles[i];
      if(e.pos[0] > this.canvas.width || e.pos[1] > this.canvas.height || e.pos[1] + e.size < 0) {
        if (this.intendedReticleAmount >= this._reticleAmount){
          this.reticles[i] = this.baseReticle();
        }
        else {
          this._reticleAmount--;
          this.reticles.remove(e);
          i--;
        }
      }
    }
  }
  private run_collider() {
    this.reticles.forEach((me, i) => {
      for(let j = i + 1; j < this.reticles.length; j++) {
        let he = this.reticles[j];
        if (isColliding(me, he)) {
          resolveCollision(getCollisionData(me, he));
        }
      }
    });
  }


  // NOTE: Dont have retina, cant do
  // //Method i copied from
  // //https://gist.github.com/callumlocke/cc258a193839691f60dd
  // //What does it do?
  // //==> Fixes scaling issues with apple products. (Retina display mit devicePixelRatio > 1)
  // private scaleCanvas(canvas, context, width, height) {
  //   // assume the device pixel ratio is 1 if the browser doesn't specify it
  //   const devicePixelRatio = window.devicePixelRatio || 1;
  //
  //   // determine the 'backing store ratio' of the canvas context
  //   const backingStoreRatio = (
  //     context.webkitBackingStorePixelRatio ||
  //     context.mozBackingStorePixelRatio ||
  //     context.msBackingStorePixelRatio ||
  //     context.oBackingStorePixelRatio ||
  //     context.backingStorePixelRatio || 1
  //   );
  //
  //   // determine the actual ratio we want to draw at
  //   const ratio = devicePixelRatio / backingStoreRatio;
  //
  //   if (devicePixelRatio !== backingStoreRatio) {
  //     // set the 'real' canvas size to the higher width/height
  //     canvas.width = width * ratio;
  //     canvas.height = height * ratio;
  //
  //     // ...then scale it back down with CSS
  //     canvas.style.width = width + 'px';
  //     canvas.style.height = height + 'px';
  //   }
  //   else {
  //     // this is a normal 1:1 device; just scale it simply
  //     canvas.width = width;
  //     canvas.height = height;
  //     canvas.style.width = '';
  //     canvas.style.height = '';
  //   }
  //
  //   // scale the drawing context so everything will work at the higher ratio
  //   context.scale(ratio, ratio);
  //
  // }
  stl() {
    return require('./drifter.css').toString();
  }
  public dark(): string {
    return require('./drifter.dark.css').toString();
  }
  public light(): string {
    return require('./drifter.light.css').toString();
  }
}

window.customElements.define('c-drifter', Drifter);


class Reticle {
  public vel: number[];
  public pos: number[];
  public size: number;

  constructor(vx: number, vy: number, posX: number, posY: number, size: number) {
    this.vel = [vx, vy];
    this.pos = [posX, posY];
    this.size = size;
  }
  public get top() {
    return this.pos[1];
  }
  public get bot() {
    return this.pos[1] + this.size;
  }
  public get left() {
    return this.pos[0];
  }
  public get right() {
    return this.pos[0] + this.size;
  }
  public addVel(vel: number[]) {
    this.vel[0] += vel[0];
    this.vel[1] += vel[1];
  }
}

interface Collision {
  normal: number[];
  depth: number;
  root: Reticle[];
}

//Vector calculation
function vecAddition(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function vecSubtraction(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function vecProduct(a, b) {
  return [a[0] * b[0], a[1] * b[1]];
}

function dotProduct(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function unitVector(v) {
  var hyp = Math.sqrt((v[0] * v[0]) + (v[1] * v[1]));
  return [v[0] / hyp, v[1] / hyp];
}

function min(a, b) {
  if(a < b){
    return a;
  }
  else{
    return b;
  }
}

function vecScalarProduct(v, s) {
  return [v[0] * s, v[1] * s];
}

function vecScalarDivision(v, s) {
  return [v[0] / s, v[1] / s];
}


function vecNegate(v) {
  return [-v[0], -v[1]];
}


function minorplus(): number {
  if (Math.random() < .5) return -1;
  return 1;
}

function isColliding(me: Reticle, he: Reticle): boolean {
  return (
    he.bot   >= me.top   &&
    he.top   <= me.bot   &&
    he.right >= me.left  &&
    he.left  <= me.right
  );
}

function resolveCollision(col: Collision) {
  var a = col.root[0];
  var b = col.root[1];

  var rv = vecSubtraction(b.vel, a.vel);

  var velAlongNormal = dotProduct(rv, col.normal);
  if (velAlongNormal > 0)return;

  var j = ((2) * velAlongNormal) / (1 / a.size + 1 / b.size);

  var impulse = vecScalarProduct(col.normal, j);

  var aVel = vecScalarDivision(impulse, a.size);
  var bVel = vecScalarDivision(impulse, -b.size);

  a.addVel(aVel);
  b.addVel(bVel);
}

function getCollisionData(me: Reticle, he: Reticle): Collision {
  let unorderedDistances = [
    Math.abs(he.bot - me.top),
    Math.abs(he.top - me.bot),
    Math.abs(he.left - me.right),
    Math.abs(he.right - me.left),
  ];

  let orderedDistances = unorderedDistances.slice();
  orderedDistances.sort((a,b) => a-b);
  let closest = orderedDistances[0];

  let normal: number[];

  if(closest == unorderedDistances[0]){
    normal = [0, -1];
  }
  else if(closest == unorderedDistances[1]){
    normal = [0, 1];
  }
  else if(closest == unorderedDistances[2]){
    normal = [1, 0];
  }
  else {
    normal = [-1, 0];
  }
  return {normal: normal, depth: closest, root: [me, he]}
}
