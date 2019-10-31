export default function init(resources: ImportanceMap<() => Promise<any>>, globalInitFunc?: (instance: any) => void) {
  const resolvements = new Map<string, Function>();
  const indexMap = new ResourcesMap();
  const alreadyResolvedResources = [];
  return function load(initalKey?: string): ResourcesMap{
    try {
      if (initalKey !== undefined) resources.getByString(initalKey).key.importance = -Infinity;
    }
    catch (e) {
      console.warn("Unexpected initalKey");
    }

    resources.forEach((e: () => Promise<object>, imp) => {

      if (imp.val !== undefined) if (indexMap.get(imp.val) === undefined) {
        if (imp.importance !== Infinity) indexMap.set(imp.val, new Promise((res) => {
          resolvements.set(imp.val, res);
        }));
        else {
          if (!alreadyResolvedResources.includes(imp.val)) {
            alreadyResolvedResources.add(imp.val);
            //@ts-ignore
            indexMap.set(imp.val, async () => {
              let res: Function;
              indexMap.set(imp.val, new Promise((r) => {
                res = r;
              }));
              let instance =  await imp.initer((await resources.getByString(imp.val).val()).default)
              if (globalInitFunc !== undefined) await globalInitFunc(instance);
              res(instance);
              return instance;
            });
          }
        }
      }
    });

    (async () => {
      await resources.forEachOrdered(async (e: () => Promise<any>, imp: Import<string>) => {
        if (imp.val !== undefined) {
          if (alreadyResolvedResources.includes(imp.val)) return;
          alreadyResolvedResources.add(imp.val);
          let instance = imp.initer((await e()).default);
          if (globalInitFunc !== undefined) await globalInitFunc(instance);
          resolvements.get(imp.val)(instance);
        }
        // just load it (and preseve in webpack cache)
        else (await e());
      });
    })();
    return indexMap;
  }
}

export class ResourcesMap extends Map<string, Promise<any>> {
  public get(key: string): Promise<any> {
    let val = super.get(key);
    if (typeof val === "function") {
      //@ts-ignore
      return val();
    }
    else return val;
  }
}



export class ImportanceMap<V> extends Map<Import<string>, V> {
  private importanceList: Import<string>[] = [];
  constructor(...map: Map<Import<string>, V>[]);
  constructor(...a: {key: Import<string>, val: V}[]);
  constructor(...a: {key: Import<string>, val: V}[] | Map<Import<string>, V>[]) {
    super();
    if (a[0] instanceof Map) {
      //@ts-ignore
      a.ea((m) => {
        m.forEach((v, k) => {
          this.set(k, v);
        })
      })
    }
    else {
      //@ts-ignore
      a.forEach((e) => {
        this.set(e.key, e.val);
      });
    }
  }
  public getByString(key: string): {key: Import<string>, val: V} {
    let kk: any, vv: any;
    this.forEach((v,k) => {
      if (k.val === key) {
        vv = v;
        kk = k;
      }
    });
    if (!kk || !vv) throw "No such value found";
    return {key: kk, val: vv};
  }
  public set(key: Import<string>, val: V): this {
    this.importanceList.add(key);
    super.set(key, val);
    return this;
  }
  public async forEachOrdered(loop: (e?: V, key?: Import<string>, i?: number) => any) {
    this.importanceList.sort((a, b) => {
      return a.importance - b.importance;
    });
    for (let i = 0; i < this.importanceList.length; i++) {
      await loop(this.get(this.importanceList[i]), this.importanceList[i], i);
    }
  }
}

export class Import<T> {
  constructor(public val: T, public importance: number, public initer: (mod: any) => any) {

  }
}
