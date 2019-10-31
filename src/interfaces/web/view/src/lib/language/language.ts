import setData, {DataBase, InvalidKey, Data} from "front-db";
import {get, post} from "../ajax/ajax";

//First capital
export function fc(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

//All capital
export function ac(s: string): string {
  return s.toUpperCase();
}

//(after) space capital
export function sc(s: string): string {
  let e = "";
  let i = s.indexOf(" ");
  while (i !== -1) {
    e += s.substring(0, i+1) + s.charAt(i+1).toUpperCase();
    s = s.substring(i+2);
	   i = s.indexOf(" ");
  }
  return fc(e + s.substring(i+1));
}

// TODO
// export function parseTime(time: Date) {
  
// }

let res: Function;

let rdy = new Promise((r) => {
  res = r;
})

let LANGUAGE: DataBase<any>;
let langData = {};

setLang(localStorage.language)

export async function setLang(to: "en" | "de") {
  if (to !== "en" && to !== "de") to = "de";
  localStorage.language = to;


  try {
    LANGUAGE = setData(await post("lang", {body: {lang: to}}), langData);
  }
  catch(e) {
    console.warn(e, "continuing anyway")
  }

  res();
}


export default async function(key: string | number | Data<string | number>): Promise<Data<string>>
export default async function(key: Array<string | number | Data<string | number> | Array<string | number | Data<string | number>>>): Promise<Data<string>[]>
export default async function(key: string | number | Data<any>, cb: (val: string) => void, aproxLength?: number): Promise<void>
export default async function(key: Array<string | number | Data<string | number> | Array<string | number | Data<string | number>>>, cb: (...val: string[]) => void, aproxLength?: number): Promise<void>
export default async function(key: string | number | Data<string | number> | Array<string | number | Data<string | number> | Array<string | number | Data<string | number>>>, cb?: (...val: string[]) => void, aproxLength: number = 1): Promise<any> {
  await rdy;

  let s = "";
  if (aproxLength !== 0) {
    s += "<pre>";
    for (let i = 0; i < aproxLength; i++) {
      s += " ";
    }
    s += "</pre>"
  }

  try {
    if (cb !== undefined) {
      let args = [];
      for (let i = 0; i < cb.length; i++) {
        args.add(s);
      }
      cb(...args);
      if (key instanceof Data) {
        await key.subscribe(async (val) => {
          await LANGUAGE.get(val, cb)
        })
      }
      else if (key instanceof Array) {

        //TODO not tested yet
        let map = [];
        await key.ea(async (k: string | number | Data<any> | Array<string | number | Data<any>>, i) => {
          let LANG = LANGUAGE;

          if (!(k instanceof Array)) k = [k];


          let setWord = (word: string) => {
            map[i] = word;
            if (map.length === key.length) cb(...map)
          }


          await k.ea(async (kk, ii) => {
            if (!(kk instanceof Data)) {
              //@ts-ignore
              if (ii === k.length-1)
                await (await LANG.get(kk, setWord))
              else
                LANG = await LANG.ref(kk);
            }
            else {
              await kk.subscribe(async (val) => {
                //@ts-ignore
                if (ii === k.length-1)
                  await LANG.get(val, setWord)
                else {
                  LANG = await LANG.ref(val)
                }
              })
            }
          })

        })
      }
      else await LANGUAGE.get(key, cb)
    }
    else {
      if (key instanceof Data) {
        let data = new Data<string>(s);

        let setWord = (word: string) => {
          data.val = word;
        }
        await key.subscribe(async (v) => {
          await LANGUAGE.get(v, setWord)
        })

        return data;
      }
      else if (key instanceof Array) {

        let map = [];
        await key.ea(async (k, i) => {
          let LANG = LANGUAGE;

          map[i] = new Data<string>("PRELUDE");

          if (!(k instanceof Array)) k = [k];

          let setWord = (word: string) => {
            map[i].val = word;
          }

          await k.ea(async (kk, ii) => {
            if (kk instanceof Data) {
              await kk.subscribe(async (v) => {
                //@ts-ignore
                if (ii === k.length-1)
                  await LANG.get(v, setWord)
                else
                  LANG = await LANG.ref(v)
              })
            }
            else {
              //@ts-ignore
              if (ii === k.length-1)
                await LANG.get(kk, setWord)
              else
                LANG = await LANG.ref(kk)
            }
          })
        })

        return map;
      }
      else {
        return await LANGUAGE.get(key);
      }

    }
  }
  //thrown when lang key cant be found
  catch(e) {
    console.warn(e.message, "Continuing with given keys: \"" + key.toString() + "\".")
    if (cb === undefined) return key
    else if (key instanceof Array) {
      key.ea((k, i) => {
        if (k instanceof Data) key[i] = k.val
      })
      //@ts-ignore
      cb(...key);
    }
    else if (cb !== undefined) cb(key instanceof Data ? key.val.toString() : key.toString());
  }
};
