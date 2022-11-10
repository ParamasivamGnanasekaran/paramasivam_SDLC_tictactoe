const url = require("url");
const fs = require('fs');
const os = require('os')
const path = require("path");

const router = require("express").Router();
const pathData = path.join(os.homedir() + "/TIC_TAC_TOE/data.json")
//SignUp for Game app
router.post('/', (req, res) => {  
try {
    let data = fs.readFileSync(pathData, 'utf8')
   let databases = JSON.parse(data)
    let email,username; 
    databases.forEach(db => {
      if(db.email===req.body.email ){
        email=db.email;
      }else if(db.username===req.body.username){
      username=db.username
      }
    });
    if(username){
        res.status(200).json({message:"already have that username"});
    }else if(email){
        res.status(200).json({message:"already have a account"});
    }else{
        data=req.body;
        data.player1=0;
        data.player2=0;
        data.computer=0;
        data.history=[];
        databases.push(data)
          fs.writeFile(pathData, JSON.stringify(databases, null, 2), (error) => {
            if (error) {
              console.log('An error has occurred ', error);
              return;
            }
            console.log('Data written successfully to disk');
          });
        res.status(200).json({message:"user created"});
    }
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`)
   res.status(400).json(err);
  }
 })


module.exports = router;