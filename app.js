const express = require("express");
const app = express();
const cors = require('cors');
var mongoose = require('mongoose');
var session = require('express-session');
var logger = require('morgan');
var connStr = 'mongodb://localhost:27017/tictactoe';
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});
const bodyParser = require('body-parser');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));


const playRoute = require('./api/routes/play');
const userRoute = require('./api/routes/user');
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());
app.use(logger('dev'));


//Saves user to avoid logging in multiple times
app.use(session({
  secret: 'jbadjhjfdkbhfb8723846hdfj',
  resave: false,
  saveUninitialized: true
}));
app.use(userRoute);
app.use('/ttt/play', playRoute);


app.use(function(req, res, next){
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use(function(error,req,res, next){
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
    console.log("error u bomb");
});

module.exports =app;
