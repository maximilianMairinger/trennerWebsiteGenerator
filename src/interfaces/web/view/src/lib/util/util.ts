import { fc } from "../language/language";

export function combineStringsCapital(s: string[]) {
  let e = "";
  s.ea((w) => {
    e += fc(w) + " ";
  });
  e = e.substring(0, e.length-1);
  return e;
}

export function combineStrings(s: string[]) {
  let e = "";
  s.ea((w) => {
    e += w + " ";
  });
  e = e.substring(0, e.length-1);
  return e;
}
