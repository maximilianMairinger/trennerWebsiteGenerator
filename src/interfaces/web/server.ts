import * as express from "express"
import * as bodyParser from 'body-parser'
import * as path from "path"


const app = express();

console.log("asd");


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use(express.static("/"));

app.get("/", (req, res) => {
  
})