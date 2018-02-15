const express = require("express");
const app = express();

const bodyParser = require('body-parser');

const playRoute = require('./api/routes/play');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/ttt/play', playRoute);

app.use((req, res, next)=>{
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error,req,res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports =app;