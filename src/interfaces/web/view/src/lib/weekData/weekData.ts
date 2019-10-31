import setData, {DataBase, DataArray, Data} from "front-db";
import { post } from "../ajax/ajax";
import Notifier from "../notifier/notifier";


let WEEKDATA: DataArray<Week>;


let res: Function;
let rdy = new Promise((r) => {
  res = r;
});

export async function setWeek(sessKey: string) {
  localStorage.sessKey = sessKey;
  let apiResponse = await post("getData");
  if(!apiResponse.err)
    WEEKDATA = setData(apiResponse).asArray;
  else {
    Notifier.error(apiResponse.err);
    return apiResponse.err;
  }
  if (WEEKDATA !== undefined) res(WEEKDATA);
  return WEEKDATA;
}

export async function getWeek() {
  //TODO: THERE IS NO NEED TO AWAIT RDY EVERYWHERE IF IT IS AWAITED HERE
  await rdy;
  return WEEKDATA;
}

export async function getAllDayIds(cb: Function) {
  let length = WEEKDATA.length();
  let params = [];
  for (let i = 0; i < length; i++) {
    WEEKDATA.get(i + ".0.period.begin", async (date: string) => {
      params[i] = new Date(date).getDay() -1;
      if (params.length === length) await cb(...params);
    })
  }
}

export async function setNote(of: DataBase<Unit>, to: string) {
  of.set("note", to);
  post("setNote",{body: {begin: await of.current("period.begin"), end: await of.current("period.end"), note: to}});
}




export const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function getDayIdFromNamePool(dayName: "monday"| "tuesday"| "wednesday"| "thursday"| "friday"| "saturday"| "sunday") {
  return weekDays.indexOf(dayName);
}

export async function getDayId(day: DataBase<Unit>, cb: Function) {
  await rdy;
  await day.get("0.period.begin", async (date: string) => {
    await cb(new Date(date).getDay()-1);
  })
}

export async function getDayElemFromName(dayName: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") {
  await rdy;
  return WEEKDATA.ref(weekDays.indexOf(dayName));
}

export async function getDayName(day: DataBase<Unit>, cb: Function) {
  await rdy;
  day.get("0.period.begin", (date: string) => {
    cb(weekDays[new Date(date).getDay()-1]);
  })
}

export async function getDayNamefromPeriod(period: DataBase<Period>, cb: Function) {
  await rdy;
  period.get("begin", (date: string) => {
    cb(weekDays[new Date(date).getDay()-1]);
  })
}


export let getAllDayNames = (() => {
  let dayNames = new Data(["N/A"])
  rdy.then(() => {
    let length = WEEKDATA.length();
    let params;
    WEEKDATA.forEach((day: DataBase<Day>, i: number) => {
      day.get("0.period.begin", (date: string) => {
        let d = new Date(date);
        params[i] = weekDays[d.getDay()-1];
        if (params.length === length) dayNames.val = [...params];
      })
    }, () => {
      params = []
    });
  })
  
  return async function getAllDayNames() {
    await rdy;
    return dayNames
  }
})();


export async function selectLesson(unit: DataBase<Unit>, toLesson: DataBase<Lesson>) {
  let period = unit.peek("period");
  let result = await post("setData", {body: {
    begin: period.current("begin"),
    end: period.current("end"),
    subject: toLesson.current("subject")
  }});

  if(result.err) {
    Notifier.error(true, result.err);
    return false;
  }
  else {
    let min = false;
    let lessons = unit.peek("lessons");
    lessons.asArray.list((lesson: DataBase<Lesson>) => {
      if (lesson.same(toLesson)) min = lesson.current("selected");
      else if (lesson.current("selected")) {
        lesson.set("selected", false);
        (lesson.peek("currentStudents")).asNumber.dec();
      }
    });
    if (toLesson.current("currentStudents") < toLesson.current("maxStudents")) toLesson.set("selected", true);
    let currentStudents = (toLesson.peek("currentStudents")).asNumber;
    if (!min && currentStudents.current() !== toLesson.current("maxStudents")) toLesson.set("currentStudents", currentStudents.inc());
    return true;
  }
}

export interface Week extends Array<Day> {

}

export interface Day extends Array<Unit> {

}

export interface Unit {
  readonly visible: Data<string>;
  readonly note: Data<string>;
  readonly period: Period;
  readonly lessons: Array<Lesson>;
}

export interface Period {
  readonly begin: Data<string>;
  readonly end: Data<string>;
  readonly name: Data<string>;
}


export interface Lesson {
  readonly subject: Data<string>;
  readonly teacher: Data<string>;
  readonly color: Data<string>;
  readonly maxStudents: Data<number>;
  readonly currentStudents: Data<number>;
  readonly selected: Data<boolean>;
}
