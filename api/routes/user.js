const express = require('express');
const nodemailer = require('nodemailer');
const router  = express.Router();
const User = require('../../models/User');
const Game = require('../../models/Game');
const Record = require('../../models/Record');

router.post('/adduser',function(req,res,next){
  //{ username:, password:, email: }
  console.log(req.body);
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (err){
      console.log(err);
      return res.json({status:"ERROR" } );
    }else{
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'sendtayomails@gmail.com',
          pass: 'J@stw0rld'
        },
        tls: {
          rejectUnauthorized: false
          }
      });

    let HelperOptions = {
      from: '"Tic Tac Toe" <tictactoe@ttt.com>',
      to: req.body.email,
      subject: 'Please confirm your account with Tic Tac Toe',
      text: 'Please use the following information for your verification \n Email:'+req.body.email+ '\nkey: abracadabra'
            +'Or use the link: http://localhost:7000/verify?email='+req.body.email+'&key=abracadabra'
    };
      transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
          return res.json({status:"ERROR" } );
        }
        console.log("The message was sent!");
        //console.log(info);
      });
        return res.json({status:"OK" });
    }
  });


});

router.post("/verify",function(req,res,next){
  //{ email:, key: }
  if(req.body.key == "abracadabra"){
    User.findOne({ email: req.body.email }, function(err, user) {
      console.log(user);
      if (err || user == null){
        return res.json({status:"ERROR" });
      }else if(user.enabled){
        return res.json({status:"OK" });
      }else{
        user.enabled = true;
        user.save();
        var userGame = new Game({
          _id: user._id,
        });
        userGame.save();
        return res.json({status:"OK" });
      }
    });
  }else{
    return res.json({status:"ERROR" } );
  }

});


router.get("/verify",function(req,res,next){
  //{ email:, key: }
  if(req.query.key == "abracadabra"){
    User.findOne({ email: req.query.email }, function(err, user) {
      console.log(user);
      if (err || user == null){
        return res.json({status:"ERROR" });
      }else if(user.enabled){
        return res.json({status:"OK" });
      }else{
        user.enabled = true;
        user.save();
        var userGame = new Game({
          _id: user._id,
        });
        userGame.save();

        return res.json({status:"OK" });
      }
    });
  }else{
    return res.status(403).json({status:"ERROR" } );
  }
});


router.post("/login",function(req,res,next){
  ///login, { username:, password: }
    User.findOne({ username: req.body.username }, function(err, user) {
      console.log(user);
      if (err || user == null){
        return res.json({status:"ERROR" });
      }else if(!user.enabled){
        return res.json({status:"ERROR" });
      }else{
        user.comparePassword(req.body.password, function(err, isMatch) {
              if (err) throw err;
              console.log(req.body.password, isMatch); // -> Password123: true
              if(isMatch){
                var hour = 3600000
                req.session.cookie.expires = new Date(Date.now() + hour)
                req.session.cookie.maxAge = hour
                req.session.user = user;
                return res.json({status:"OK" });
              }else{
                return res.json({status:"ERROR" });
              }
        });

      }
    });
});


router.post("/logout",function(req,res,next){
    req.session.cookie.expires = new Date(Date.now() - 1);
    return res.json({status:"OK" });
});


router.post("/listgames",function(req,res,next){
    if(req.session.user){
      var recordArray = [];
      Record.find({userId: req.session.user._id},(err,records)=>{
        records.forEach((record)=>{
          // games:[ {id:, start_date:}, …] }
          var body = {
                      id: record._id,
                      start_date: record.createdAt
                    }
          recordArray.push(body);
        });
        return res.json({
          status:"OK",
          games: recordArray
        });

      });
    }else{
      return res.json({status:"ERROR" });
    }

});

router.post("/getgame",function(req,res,next){

    if(req.session.user){
      Record.findOne({ _id: req.body.id }, function(err, record) {
        //{ status:”OK”, grid:[“X”,”O”,…], winner:”X” }
        console.log("KJDHSGFAYJTVDWYUBE->>>>>>"+err);
        if(record == null || err){
          return res.json({status:"ERROR"});
        }else{
          return res.json({
            status:"OK",
            grid: record.grid,
            winner: record.winner
          });
        }


      });
    }else{
      return res.json({status:"ERROR"});
    }

});


router.post("/getscore",function(req,res,next){

    if(req.session.user){
      var wins=0;
      Record.count({ userId: req.session.user._id, winner: 'X'},(err, doc)=>{
        wins =doc;
        var draw=0;
        Record.count({ userId: req.session.user._id, winner: ' '},(err, doc)=>{
          draw =doc;
          var loss = 0;
          Record.count({ userId: req.session.user._id, winner: 'O'},(err, doc)=>{
            loss =doc;
            return res.json({
               status:"OK",
               human : wins,
               wopr: loss,
               tie: draw
            });
          });
        });
      });
    }else{
      return res.json({status:"ERROR"});
    }

});




module.exports = router;
