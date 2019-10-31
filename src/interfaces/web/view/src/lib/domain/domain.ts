let dir = "/";
export let domainIndex: string[] = [];
domainIndex = document.location.pathname.split(dir)
domainIndex.remove("");
let commonTitle = "LBP - ";
let argData = "internal";

function replace(subdomain: string, badKey: string, goodKey: string, preventWarning: boolean): string {
  if (subdomain.includes(badKey)) {
    let oldSubdomain = subdomain;
    subdomain = subdomain.replace(badKey, goodKey)
    if (!preventWarning) console.warn("Found at least one \"" + badKey + "\" in given subdomain: \"" + oldSubdomain + "\". Replacing it with \"" + goodKey + "\"; Resulting in \"" + subdomain + "\".")
  }
  return subdomain
}

export function set(index: number, subdomain: string, push: boolean = false, preventWarning = false) {
  subdomain = replace(subdomain, "/", "-", preventWarning)
  subdomain = replace(subdomain, " ", "_", preventWarning)

  let length = domainIndex.length;
  if (length < index || index < 0) {
    console.warn("Unexpected index: " + index + ". Replacing it with " + length + ".")
    index = length
  }
  domainIndex.splice(index+1);
  if (domainIndex[index] === subdomain) return;
  domainIndex[index] = subdomain;
  let domain = dir + domainIndex.join(dir);

  let args = [argData, commonTitle + domainIndex.last, domain]
  //@ts-ignore
  if (push) history.pushState(...args);
  //@ts-ignores
  else history.replaceState(...args);
}


global.abc = set;
