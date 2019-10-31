log("api-url: \"" + apiUrl + "\".")
export async function post(url: string | string[], {headers: h = {'Content-Type': 'application/json'}, body: b = {}}: PostConf = {}) {
  let o: any = typeof b === "string" ? JSON.parse(b) : b;
  if (o.sess_key !== undefined) console.warn("sessKey in post body is not empty.", o);
  else o.sess_key = localStorage.sessKey || "";
  try {
    return await (await fetch(validateURL(url), {
      headers: new Headers(h),
      method: "POST",
      body: JSON.stringify(o)
    })).json();
  } catch (e) {
    console.error("POST request failed at " + validateURL(url));
    (async () => {
      (await import("../notifier/notifier")).default.error("network_err", "currently_offline")
    })();
  }
}


interface PostConf {
  headers?: HeadersInit;
  body?: object | string;
}

export async function get(...url: string[]) {
  return await (await fetch(validateURL(url))).json();
}

let dir = "/"
function validateURL(url: string[] | string) {
  url = (url instanceof Array) ? url : [url];
  let fullUrl = "";
  url.ea((urlPart) => {
    if (urlPart.charAt(urlPart.length - 1) === dir) urlPart = urlPart.substring(0, urlPart.length - 1);
    fullUrl += urlPart;
  });

  if (url[0].substring(0, 4) !== "http") fullUrl = apiUrl + fullUrl;

  return fullUrl;
}
