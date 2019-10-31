console.log("asd");


let evsrc = new EventSource("//127.0.0.1:1000/sse")

evsrc.onopen = () => {
  console.log("open");
  
}

evsrc.onmessage = (e) => {
  
  console.log(e.data);
}