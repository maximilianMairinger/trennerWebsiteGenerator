import Button from "./../button";
import Notifier from "../../../lib/notifier/notifier";


function getFileExtention(filename: string): string {
  let p = ".";
  if (filename.indexOf(p) !== -1) return filename.split(p).pop();
  return "";
}

let imgExtentions = ["jpg", "png", "gif", "jpeg", "svg"];

const keywords = {
  img: imgExtentions,
  image: imgExtentions,
};

function matchesExtentionWildcard(ext: string, allowedExtention: string) {
  let isok = false;
  for (let key in keywords) {
    if (allowedExtention === key) {
      keywords[key].ea((e) => {
        if (e === ext) isok = true;
      });
    }
  }
  return isok;
}


export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file === undefined) return resolve("");
    reader.readAsDataURL(file);
    //@ts-ignore
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class Upload extends Button {
  private inputElem: HTMLInputElement;
  private _file: File;

  private fileUploadCbs: Function[] = [];
  constructor(public allowedExtention?: string | string[], fileUploadCb?: (file?: File, base64?: string) => any) {
    super(() => {
      this.open();
    });

    this.tabIndex = 0;

    if (fileUploadCb !== undefined) this.addFileUploadCb(fileUploadCb);

    let fileUploadFunc = async () => {
      let ext = getFileExtention(this._file.name);
      if (typeof this.allowedExtention === "string") {
        let ok = ext === this.allowedExtention || matchesExtentionWildcard(ext, this.allowedExtention);
        extentionNotification(ok);
        if (!ok) return;
      }
      else if (this.allowedExtention instanceof Array) {
        let isok = false;
        this.allowedExtention.ea((e) => {
          if (ext === e || matchesExtentionWildcard(ext, e)) isok = true;
        })
        extentionNotification(isok);
        if (!isok) return;
      }

      arrow.css("display", "none");

      if (matchesExtentionWildcard(ext, "img")) {
        let b = await this.getAsBase64();
        let img = ce("img");
        img.addClass("displayimg");
        img.src = b;
        filedisplay.inner = img;
        this.fileUploadCbs.ea((f) => {
          f(this.file, b);
        });
      }
      else {
        filedisplay.inner = this.file.name;
        this.fileUploadCbs.ea((f) => {
          f(this.file);
        });
      }


    };

    this.inputElem = ce("input");
    this.inputElem.type = "file";
    this.inputElem.on("change", () => {
      if (this.inputElem.files[0] === undefined) return;
      this._file = this.inputElem.files[0];
      fileUploadFunc();
    });



    let interactive = ce("upload-interactive");
    interactive.on("mouseover", () => {
      display.addClass("hov");
    });
    interactive.on("mouseout", () => {
      display.removeClass("hov");
    });
    interactive.on("dragenter", () => {
      display.addClass("drg");
    });
    interactive.on("dragleave", (e) => {
      display.removeClass("drg");
    });
    this.on("focus", () => {
      display.addClass("foc");
    });
    this.on("blur", () => {
      display.removeClass("foc");
    });

    let extentionNotification = (isok: boolean) => {
      if (!isok) Notifier.error("filetype_not_allowed");
    }

    interactive.on("drop", (e) => {
      e.preventDefault();
      this._file = e.dataTransfer.files[0];
      fileUploadFunc();
    }, false);

    interactive.on("dragover", (e) => {
      e.preventDefault();
    }, false);


    let display = ce("upload-display");

    let arrow = ce("img");
    arrow.src = "./assets/drop.svg";
    arrow.addClass("smallimg");

    let filedisplay = ce("upload-file-display");

    let cover = ce("upload-cover");


    display.apd(arrow, filedisplay, cover);



    this.sra(display, interactive, this.inputElem);
  }

  public open() {
    this.inputElem.click();
  }

  public addFileUploadCb(cb: (file?: File, base64?: string) => any) {
    this.fileUploadCbs.add(cb);
  }
  public removeFileUploadCb(cb: (file?: File, base64?: string) => any) {
    this.fileUploadCbs.remove(cb);
  }

  public get file() {
    return this._file;
  }

  public getAsBase64(): Promise<string> {
    return convertToBase64(this.file);
  }
  stl() {
    return require('./upload.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./upload.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./upload.light.css').toString();
  }
}
window.customElements.define('c-upload', Upload);
