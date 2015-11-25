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
        },10);
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
    console.log("end0");
    if (!gameCtrl){
        gameCtrl = new GameController({
            "width" : 1500,
            "height" : 300
        });
        gameCtrl.play();
    }

    console.log("end1");
    res.render('pong',
        {   title: 'myPong',
            game : JSON.stringify(gameCtrl.game)
        }
    );
    console.log("end2");
});

router.get('/balls', function(req, res, next) {
    res.json(gameCtrl.game.balls);
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

module.exports = router;
