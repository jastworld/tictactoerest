const express = require('express');
const router  = express.Router();


var checkwinner = (game)=>{
    var i=0;

    //check for horizontal winner
    while(i<9){
        console.log("1: "+i);
        if(game[i]==game[i+1] && game[i]==game[i+2]){
            if(game[i]=="")
                break;
            else
                return game[i];
        }
        i+=3;
    }
    i=0;
    //Check for vertical winner
    while(i<3){
        console.log("2: "+i);
        if(game[i]==game[i+3] && game[i]==game[i+6]){
            if(game[i]=="")
                break;
            else
                return game[i];
        }
        i++;

    }
    console.log(game[0]);
    //Diagonal winner
    if(game[0]==game[4] && game[0]==game[8])
        return game[0];
    if(game[2]==game[4] && game[0]==game[6])
        return game[2];
    

    return "";
};
router.post('/',(req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    console.log(req.body);
    const game = {
        grid: req.body.grid
    }
    for (let i = 0; i < 9; i++) {
        if (game.grid[i] === "") {
            game.grid[i] = "O";
            break;
        }
    }
    checkwinner(game.grid)
    console.log(req.body);
    return res.status(200).json({
        grid: game.grid,
        winner: checkwinner(game.grid)
    });

});

router.post('/ccc',(req,res,next)=>{
    res.setHeader("Cache-Control: no-cache,no-store");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send("Is this what you want?").end();
});

router.get('/ccc',(req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    res.send("Is this what you want?").end();
});


module.exports = router;
