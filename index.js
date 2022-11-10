//Import modules
const express = require("express");
const app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
const path = require("path");
const fs   = require('fs');
const os = require('os');
// Create 
function mkdirpath(dirPath)
{
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      fs.writeFileSync(dirPath+"/data.json","[]",{flag:"w"});
    }
  } catch (err) {
    console.error(err);
  }
}

// Create folder path
mkdirpath(path.join(os.homedir() + "/TIC_TAC_TOE"));

app.use(express.static(__dirname + "./"));

// Server PORT number
let port = process.env.PORT || 3000;

//Rendering html content of user enter form
app.get("/", function (req, res) {
  let indexPath = path.join(__dirname, "./HTML/index.html");
  res.sendFile(indexPath);
});

//Rendering html content of user enter form
app.get("/*.html", function (req, res) {
    let indexPath = path.join(__dirname,  "./HTML" + req.url);
    res.sendFile(indexPath);
  });

//Rendering css content of user enter form
app.get("/CSS/*.css", function (req, res) {
  let indexPath = path.join(__dirname, "." + req.url);
  res.sendFile(indexPath);
});

//Rendering javascript content of user enter form
app.get("/javascript/*.js", function (req, res) {
  let indexPath = path.join(__dirname, "." + req.url);
  res.sendFile(indexPath);
});

//Rendering svg content of user enter form
app.get("/assets/*.jpg", function (req, res) {
  let indexPath = path.join(__dirname, "." + req.url);
  res.sendFile(indexPath);
});
 
//Rendering ico content of user enter form
app.get("/assets/*.ico", function (req, res) {
  let indexPath = path.join(__dirname, "." + req.url);
  res.sendFile(indexPath);
});

//Importing api files
const loginRouter = require("./Nodejs/login");
const signupRouter = require("./Nodejs/signUp");
const gameRouter = require("./Nodejs/game");
const { dir } = require("console");
const { json } = require("body-parser");

//Routing to api files
app.use("/api/login",loginRouter);
app.use("/api/signup",signupRouter);
app.use("/api/game",gameRouter);

// listen for requests'
app.listen(port, () => {
  console.log(`App listening on port ${port} `);
});