import Element from './../element';
import getUserData from "../../lib/userData/userData";

export default class Avatar extends Element {
  private url: string;
  private imgWrapper: HTMLElement;
  constructor() {
    super(false, false);
    this.imgWrapper = ce("img-wrapper");
    this.sra(this.imgWrapper);
    // getUserData().get("avatar", (avatar: string) => {
      this.image = apiUrl + "avatars/default-avatar.png";
    //});
  }
  set image(to: string) {
    this.url = to;
    let img = ce("img");
    img.src = to;
    img.on("load", () => {
      if (img.width >= img.height) {
        img.css("height", "100%");
        //That complicated since height: 100% doesnt get rendered when not display block, width however does.
        img.css("marginLeft", (this.width - (img.width / (img.height / this.height))) / 2)
      }
      else {
        img.css("width", "100%");
        img.css("marginTop", (this.height - (img.height / (img.width / this.width))) / 2)
      }
      this.imgWrapper.inner = img;
      img.anim({opacity: 1}, {duration: 300});
    });
  }
  get image():string {
    return this.url;
  }
  stl() {
    return require('./avatar.css').toString();
  }
  public dark(): string {
    return require('./avatar.dark.css').toString();
  }
  public light(): string {
    return require('./avatar.light.css').toString();
  }
}
window.customElements.define('c-avatar', Avatar);


//"https://picsum.photos/2000/2000";
//"src/Element/avatar/default-avatar.png";
