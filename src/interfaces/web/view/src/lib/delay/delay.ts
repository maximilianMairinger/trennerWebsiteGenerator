export default function delay(ms: number): Promise<any>;
export default function delay(ms: number, res: Function): void;
export default function delay(ms: number, res?: Function): Promise<any> | void {
  if (res === undefined) {
    let ctr, rej, p = new Promise((resolve, reject) => {
      ctr = setTimeout(resolve, ms);
      rej = reject;
    });
    //TODO: Cancle skip
    //@ts-ignore
    //p.cancel = function(){ clearTimeout(ctr); rej(Error("Cancelled"))};
    return p;
  }
  else {
    return new Promise((r) => {
      setTimeout(async () => {
        await res();
        r()
      }, ms)
    })
  }
}
