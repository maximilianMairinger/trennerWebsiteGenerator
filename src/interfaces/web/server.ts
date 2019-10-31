import * as express from "express"
import * as bodyParser from 'body-parser'
import * as path from "path"


const app = express();

function sendFile(res, p) {
  res.sendFile(path.join(__dirname, "../../../src/interfaces/web", p));
}



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use("/dist", express.static("dist"));

app.get('*', (req, res) => {
  sendFile(res, "./view/index.html")
});


app.listen(1000, (err) => {
  if (err) console.log(err);
  else console.log("Listening on 1000");
})