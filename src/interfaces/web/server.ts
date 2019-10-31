import * as express from "express"
import * as bodyParser from 'body-parser'
import * as path from "path"


const app = express();


function route(p) {
  return path.join(__dirname, "../../../src/interfaces/web/view", p);
}



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use("/dist", express.static(route("./dist/")));

app.get('/', (req, res) => {
  res.sendFile(route("./index.html"))
});

app.get("/sse", (req, res) => {
  res.status(200).set({
    "connection": "keep-alive",
    "cache-control": "no-cache",
    "content-Type": "text/event-stream"
  })

  let i = 0
  setInterval(() => {
    i++
    res.write("data: hellow world!\n\n")
    //res.write("data " + i +  ": at " + Date.now() + "\n\n")
  }, 200)
})


app.listen(1000, (err) => {
  if (err) console.log(err);
  else console.log("Listening on 1000");
})