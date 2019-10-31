import setData, {DataBase, DataArray, Data} from "front-db";
import {post, get,} from "../ajax/ajax";
import Notifier from "../notifier/notifier";


let UNITDATA: DataArray<Unit>;


let res: Function;
let rdy = new Promise((r) => {
  res = r;
});


export async function setUnit(sessKey: string) {
  localStorage.sessKey = sessKey;
  let apiResponse = await post("getTeacherData")
  if (!apiResponse.err) {
    UNITDATA = setData(apiResponse).asArray;
  }
  else {
    return apiResponse.err;
  }


  if (UNITDATA !== undefined) res(UNITDATA);
  global.UNITDATA = UNITDATA;
}

export async function getUnit() {
  await rdy;
  return UNITDATA;
}


export async function getAllLBNames(cb: (...names: string[]) => void) {
  await rdy;
  let length = await UNITDATA.length();
  let params = [];
  await UNITDATA.forEach(async (lb: DataBase<LB>, i: number) => {
    await lb.get("name", async (name: string) => {
      params[i] = name;
      if (params.length === length) await cb(...params);
    })
  });
}


export interface Unit extends Array<LB> {

}

export interface LB {
  readonly name: Data<string>;
  readonly subjects: Data<Subject[]>;
}

export interface Subject {
  readonly teacher: Data<string>;
  readonly name: Data<string>;
  readonly color: Data<string>;
  readonly maxStudents: Data<number>;
  readonly students: Array<Student[]>;
}

export interface Student {
  readonly name: Data<string>;
  readonly klasse: Data<string>;
}
