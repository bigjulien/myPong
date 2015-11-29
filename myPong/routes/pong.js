/**
 * Created by Tom on 17/08/2015.
 */
var express = require('express');
var router = express.Router();

var Game = require('../model/Game.js')

var gameCtrl;

function GameController(params) {
    this.run = 0;
    this.game = new Game(params); //This is the gameMotor
    this.game.init();
    this.timeRunning=0;
}

GameController.prototype.play =function(){

    if(this.run){
        clearInterval(this.run);
        this.run=0;
    }
    else{
        var self=this;
        this.run = setInterval(function(){
            self.game.playOneStep();
        },25);
    }
};

GameController.prototype.setSpeed = function(speed){
    console.log("Setting speed to : " + speed);
    this.game.speed = speed;
};

GameController.prototype.addRandomBall = function(){
    console.log("Adding a random ball ...");
    this.game.addRandomBall();
};

router.get('/', function(req, res, next) {
    if (!gameCtrl){
        gameCtrl = new GameController({
            "width" : 700,
            "height" : 300,
            "speed" : 3
        });
        gameCtrl.play();
    }

    res.render('pong',
        {   title: 'myPong',
            game : JSON.stringify(gameCtrl.game)
        }
    );
});

router.get('/balls', function(req, res, next) {
    res.json({"balls" : gameCtrl.game.balls,
                "rackets" : gameCtrl.game.rackets}
    );
});

router.post('/togglePlay', function(req, res, next){
    console.log("Player wanna Play");
    gameCtrl.play();
    res.send('200')
});

router.post('/pause', function(req, res, next){
    console.log("Player wanna pause")
    gameCtrl.play();

    res.send('200')
});


router.post('/speed/increment', function(req, res, next){
    gameCtrl.game.setSpeed(gameCtrl.game.speed + 1);
    res.send('200')
});

router.post('/speed/decrement', function(req, res, next){
    gameCtrl.game.setSpeed(gameCtrl.game.speed - 1);
    res.send('200')
});

router.post('/speed/:speed', function(req, res, next){
    console.log("Setting speed : " + req.params.speed);
    gameCtrl.game.setSpeed(req.params.speed);
    res.send('200')
});

router.post('/racket', function(req, res, next){
    gameCtrl.game.rackets[0].ball.position.x = parseInt(req.body.x);
    gameCtrl.game.rackets[0].ball.position.y = parseInt(req.body.y);
   // console.log(req.body.y);
    res.send('200');
});

module.exports = router;
