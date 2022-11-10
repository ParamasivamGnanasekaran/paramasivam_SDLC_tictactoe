const url = require("url");
const fs = require("fs");
const os = require('os');
const path = require("path");

const router = require("express").Router();
const pathData = path.join(os.homedir() + "/TIC_TAC_TOE/data.json");
//Login to Game app
router.post("/", (req, res) => {
  try {
    const data = fs.readFileSync(pathData, "utf8");
    const databases = JSON.parse(data);
    let email, password, username, player1, player2, computer, history;

    databases.forEach((db) => {
      if (db.email === req.body.email) {
        email = db.email;
        if (db.password === req.body.password) {
          password = db.password;
          username = db.username;
          player1 = db.player1;
          player2 = db.player2;
          computer = db.computer;
          history = db.history;
        }
      }
    });
    if (email && password) {
      res
        .status(200)
        .json({
          email: email,
          password: password,
          username: username,
          player1: player1,
          player2: player2,
          computer: computer,
          history: history,
        });
    } else if (email) {
      res.status(200).json({ message: "Password incorrect" });
    } else {
      res.status(200).json({ message: "user not found" });
    }
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
    res.status(400).json(err);
  }
});

module.exports = router;
