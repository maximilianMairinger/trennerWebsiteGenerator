import Panel from "./../panel";
import Overview from "./../../../_window/subjectOverviewWindow/subjectOverviewWindow";
import { getWeek, Lesson, Day, Unit } from "./../../../../lib/weekData/weekData";
import { DataBase, DataArray } from "front-db";


let idls = [];
export function identifyForGrid(db: DataBase<Lesson>) {
  //The "i" is important for gridlayout (strange bugs otherwise)
  for (let i = 0; i < idls.length; i++) {
    //@ts-ignore
    if (db.data.val === idls[i].data.val) return "i" + i;
  }
  idls.add(db);
  return "i" + (idls.length-1);
}

async function getMaxUnitsPerDay() {
  let max = 0;
  (await getWeek()).forEach((d: DataBase<Day>) => {
    let da = d.asArray;
    if(max < da.length()) max = da.length();
  });
  return max;
}
async function getMaxDays() {
  return (await getWeek()).length();
}

function mkTemp(grid: string[][]): string {
  let end = "";
  grid.ea((g) => {
    end += '"';
    g.ea((s) => {
      end += s + " ";
    });
    end += '" ';
  })
  return end;
}

// TODO: Clean up
async function toTemplate() {
  let grid = [];
  let maxLessons = await getMaxUnitsPerDay();

  (await getWeek()).list((d: DataBase<Day>, i) => {
    let day = d.asArray;
    grid[i] = [];
    for (let j = 0; j < maxLessons; j++) {
      let li = Math.floor((j / maxLessons) * day.length());
      let lessons: DataArray<Lesson[]> = day.peek(li, "lessons").asArray;

      lessons.list((lesson: DataBase<Lesson>) => {
        grid[i][j] = identifyForGrid(lesson);
      });
    }

  });

  return mkTemp(grid)
}
function toFr(num: number): string {
  let s = "";
  for (let i = 0; i < num; i++) {
      s += "1fr "
  }
  return s;
}

export default class OverviewPanel extends Panel {
  protected domainName = "overview";

  private body: HTMLElement;
  constructor() {
    super();
    this.body = ce("overview-panel-body");
    this.sra(this.body);
  }
  protected activationCallback(active: boolean) {
    super.activationCallback(active)
  }
  public async fetchData() {
    let week = await getWeek();

    this.body.emptyNodes();


    week.forEach((day: DataBase<Day>) => {
      day.asArray.forEach((unit: DataBase<Unit>) => {
        let o = new Overview(unit)
        this.body.apd(o);
      })
    });

    let needToUpdateLayoutWhenChanged = [];
    week.list((day: DataBase<Day>) => {
      needToUpdateLayoutWhenChanged.add(day.get(""))
    });
    week.get(["", ...needToUpdateLayoutWhenChanged], (async () => {
      this.body.css({gridTemplateColumns: toFr(await getMaxUnitsPerDay()), gridTemplateRows: toFr(await getMaxDays())});
      this.body.css("gridTemplateAreas", await toTemplate());
    }));

    this.body.anim({opacity: 1})
  }
  stl() {
    return super.stl() + require('./overviewPanel.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./overviewPanel.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./overviewPanel.light.css').toString();
  }
}
window.customElements.define('c-overview-panel', OverviewPanel);
