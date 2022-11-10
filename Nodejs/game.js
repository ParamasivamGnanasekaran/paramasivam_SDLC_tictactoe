const url = require("url");
const fs = require('fs');
const os = require('os');
const path = require("path");

const router = require("express").Router();
const pathData = path.join(os.homedir() + "/TIC_TAC_TOE/data.json")
//Game app
router.post('/', (req, res) => {  
try {
    const data = fs.readFileSync(pathData, 'utf8')
   const databases = JSON.parse(data)
    let email;
    databases.forEach(db => {
      if(db.email===req.body.email ){
        email=db.email;
       db.player1=req.body.player1;
       db.player2=req.body.player2;
       db.computer=req.body.computer;
       if(req.body.history){
        db.history.push(req.body.history)
       }else{
        db.history=[];
       }
      }
    });
     if(email){
        fs.writeFile(pathData, JSON.stringify(databases, null, 2), (error) => {
            if (error) {
              return;
            }
          });
        res.status(200).json({message:"Sucessfully updated"});
    }else{
        res.status(200).json({message:"user not found"});
    }
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`)
   res.status(400).json(err);
  }
 })




module.exports = router;
