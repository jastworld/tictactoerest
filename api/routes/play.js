const express = require('express');
const router  = express.Router();
const Game = require('../../models/Game');
const Record = require('../../models/Record');


var is_tie = function(game){
    for(i=0;i<9;i++){
      if(game.grid[i]===" "){
        console.log("No tie space dey");
        return false;
      }
    }
    console.log("Tie na");
    return true;
};


var saveRecord = function(req,game,winner){
  var record = new Record({
    userId: req.session.user._id,
    grid: game.grid,
    winner: winner
  });
  record.save();
  Record.count({userId: req.session.user._id},(err,res)=>{
      var count = res;

      Record.findOne({userId: req.session.user._id, recordId: 0}, (err, innerRec)=>{
        if(err){
          return false;
        }
        if(innerRec){
          console.log("Inner:"+res);
          innerRec.recordId = count;//get record count and add 1,
          innerRec.save();
        }else{
          return false;
        }
      });
  });

  game.grid = [" "," "," ",
                " "," "," ",
                " "," "," "];
  return true;
};
var checkwinner = function(game){
    var i=0;
    //check for horizontal winner
    while(i<9){
        if(game[i]==game[i+1] && game[i]==game[i+2]){
            if(game[i]==" ")
                break;
            else
                return game[i];
        }
        i+=3;
    }
    i=0;
    //Check for vertical winner
    while(i<3){
        if(game[i]==game[i+3] && game[i]==game[i+6]){
            if(game[i]==" ")
                break;
            else
                return game[i];
        }
        i++;

    }
    //Diagonal winner
    if(game[0]==game[4] && game[0]==game[8])
        return game[0];
    if(game[2]==game[4] && game[2]==game[6])
        return game[2];
    return " ";
};


router.get('/',function(req,res,next){
    res.render('index',{title:"Tic Tac Toe"});
    console.log("Max age: "+req.session.cookie.originalMaxAge);
    if(req.session.user){
      console.log("You are signed in"+ req.session.user._id);
      Game.findOne({_id: req.session.user._id}, (err, game)=>{
        console.log(game.grid);
      });
    }else{
      console.log("You are unauthorized in");
    }

});

router.post('/',function(req,res,next){
    var winner=" ";

    if(req.session.user){
      console.log("You are signed in "+ req.session.user._id);
      Game.findOne({_id: req.session.user._id}, (err, game)=>{
        //console.log(game.grid);
        //var currentGame = game.grid;
        var move = req.body.move;
        //Life saver
        if(move > 8 || move == null || game.grid[move]!=" "){

        }else{
          game.grid.set(move, "X");
          //game.update();
          if(is_tie(game)){
            saveRecord(req,game,winner);
          }else if((winner = checkwinner(game.grid)) == " "){
              //Continue move
              for (let i = 0; i < 9; i++) {
                  if(game.grid[i] === " ") {
                      game.grid.set(i, "O");
                      break;
                  }
              }
              if(is_tie(game)){
                saveRecord(req,game,winner);
              }else if((winner = checkwinner(game.grid)) != " "){
                  //count loss
                saveRecord(req,game,winner);
              }
          }else{
            saveRecord(req,game,winner);
            //Count loss/win and restart game
          }
          game.save();
        }
        res.status(200).json({
          grid: game.grid,
          winner: winner
        });
      });
    }else{
      return res.json({status:"ERROR" });
    }

});




module.exports = router;
