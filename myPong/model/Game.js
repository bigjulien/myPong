/**
 * Created by Tom on 17/08/2015.
 */

var Field = require('../model/Field.js');
var Ball = require('../model/Ball.js');
var Point = require('../model/Point.js');
var Vector = require('../model/Vector.js');
var Racket = require('../model/Racket.js');

var random = function(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
};

var randomPoint = function(minX, minY, maxX, maxY){
    //console.log("P : x:" + p.x + " y:"+ p.y);
    return new Point(random(minX, maxX), random(minY, maxY));
};

var randomColor = function(){
    var R = Number(random(0,15)).toString(16),
        G = Number(random(0,15)).toString(16),
        B = Number(random(0,15)).toString(16);

    return '#' + R + G + B;
};

//GAME
/**
 *A game is composed of a field and a list of balls.
 */

function Game(params){
    if (!params) params={};
    this.speed = params.speed || 1;
    this.field = params.field || new Field(params);
    this.balls = params.balls || [];
    this.walls = params.walls || [];
    this.rackets = [];
}


Game.prototype.addBall = function(ball){
    var pushable = this.field.canContain(ball) && !ball.collidesOneBall(this.balls);
    if (pushable)
        this.balls.push(ball);
    return pushable;
};

Game.prototype.createRacket = function(xPos, yPos){
    console.log('creating racket');
    var racket = new Racket(xPos, yPos);
    var pushable = this.field.canContain(racket.ball) && !racket.ball.collidesOneBall(this.balls);
    if (pushable)
        this.rackets.push(racket);
    console.log(pushable);
    return pushable;
};

Game.prototype.populate = function(nbBalls){

    this.createRacket(3*this.field.width/4,this.field.height/2);

    for (var i = 0 ; i < nbBalls ; ++i){
        var added = this.addBall(new Ball({ "name":i, "radius" : random(25,100), "position" : new randomPoint(0,0,this.field.width,this.field.height),"velocityVector" : new Vector(random(-3,3),random(-3,3)), "color" : randomColor()}));
        while (!added){
            added = this.addBall(new Ball({ "name":i, "radius" : random(25,100), "position" : new randomPoint(0,0,this.field.width,this.field.height),"velocityVector" : new Vector(random(-3,3),random(-3,3)), "color" : randomColor()}));
        }
    }
};

Game.prototype.printBalls = function() {
    var str ="Nouvelle iteration : \n";
    for (var i = 0; i < this.balls.length; ++i) {
        str+=("\tBalle n°"+i+" : "+this.balls[i].position.toString()+"\n");
    }
    return str;
};

Game.prototype.handleWallCollision = function(ball) {
    var nextPosX = ball.position.x+ball.velocityVector.x,
        nextPosY = ball.position.y+ball.velocityVector.y;
    if(nextPosX<ball.radius || nextPosX>(this.field.width-ball.radius))
        ball.bounce("HORIZONTAL");
    else if(nextPosY<ball.radius || nextPosY>(this.field.height-ball.radius))
        ball.bounce("VERTICAL");
};

Game.prototype.handleRacketCollision = function(ball, racket){

    //console.log('b' + this.rackets[0].ball.position);
    this.handleBallCollision(ball, racket.ball);

    //console.log('a' + this.rackets[0].ball.position);
   // console.log("handling for rackets");
    racket.ball.velocityVector=new Vector(0,0);
};

Game.prototype.handleBallCollision = function (ballA, ballB) {
    //alert('COLLISION : ' + ballA.name + ' and ' + ballB.name);
    var willCollide = ballA.willCollide(ballA.velocityVector.minus(ballB.velocityVector), ballB);

    if (!willCollide) {
        return false;
    }

    ballA.position = ballA.position.translate(ballA.velocityVector.times(willCollide));
    ballB.position = ballB.position.translate(ballB.velocityVector.times(willCollide));
    //  console.log("distance between : " + (ballB.position.minus(ballA.position)).norm() + " radii sum : " + (ballA.radius+ballB.radius));

    //console.log("###Collison between : " + ballA.angle + " and " + ballB.angle);
    var normX = ballB.position.x - ballA.position.x;
    var normY = ballB.position.y - ballA.position.y;
    var normLength = Math.sqrt(normX * normX + normY * normY);
    //var squareNormLength = Math.pow(normX,2)  +Math.pow(normY,2);
    var normal = new Vector(normX / normLength, normY / normLength);
    var tangent = new Vector(-normal.y, normal.x);
    //console.log("#Normal : x:" + normal.x + " y:" + normal.y);
    //console.log("#Tangent : x:" + tangent.x + " y:" + tangent.y);
    var van = normal.dot(ballA.velocityVector);
    var vat = tangent.dot(ballA.velocityVector);
    var vbn = normal.dot(ballB.velocityVector);
    var vbt = tangent.dot(ballB.velocityVector);
    //console.log("#speed of ball A on : normal:" + van + " tangent:" + vat);
    //console.log("#speed of ball B on : normal:" + vbn + " tangent:" + vbt);
    var newTenVelA = vat;
    var newTenVelB = vbt;
    var newNormVelA = (van * (ballA.mass - ballB.mass) + 2 * ballB.mass * vbn) / (ballA.mass + ballB.mass);
    var newNormVelB = (vbn * (ballB.mass - ballA.mass) + 2 * ballA.mass * van) / (ballA.mass + ballB.mass);
    //console.log("#New speed of ball A on : normal:" + newNormVelA + " tangent:" + newTenVelA);
    //console.log("#New speed of ball B on : normal:" + newNormVelB + " tangent:" + newTenVelB);
    var newTenVectA = new Vector(newTenVelA * tangent.x, newTenVelA * tangent.y);
    var newTenVectB = new Vector(newTenVelB * tangent.x, newTenVelB * tangent.y);
    var newNormVectA = new Vector(newNormVelA * normal.x, newNormVelA * normal.y);
    var newNormVectB = new Vector(newNormVelB * normal.x, newNormVelB * normal.y);
    var finalAvect = new Vector(newTenVectA.x + newNormVectA.x, newTenVectA.y + newNormVectA.y);
    var finalBvect = new Vector(newTenVectB.x + newNormVectB.x, newTenVectB.y + newNormVectB.y);
    //console.log("#New speed of ball A on : x:" + finalAvect.x + " y:" + finalAvect.y);
    //console.log("#New speed of ball B on : x:" + finalBvect.x + " y:" + finalBvect.y);
    ballA.velocityVector = finalAvect;
    ballB.velocityVector = finalBvect;
    ballA.position = ballA.position.translate(ballA.velocityVector.times(1-willCollide));
    ballB.position = ballB.position.translate(ballB.velocityVector.times(1-willCollide));
    return true;
};

Game.prototype.init = function(){
    this.populate(3);
    this.modifySpeed(this.speed);
};

Game.prototype.playOneStep = function() {
    for (var i = 0; i < this.balls.length; ++i) {
        for(var j=0 ; j < this.rackets.length; ++j){
            this.handleRacketCollision(this.balls[i], this.rackets[j]);
        }
        this.handleWallCollision(this.balls[i]);
        for(var j=i+1 ; j < this.balls.length; ++j){
            this.handleBallCollision(this.balls[i],this.balls[j])
        }
        this.balls[i].move(this.speed);
        //console.log("Total energy : " + energySum(this.balls));
    }
};

Game.prototype.addRandomBall = function(){
    var ball = new Ball({ "radius" : random(25,100), "position" : new randomPoint(0,0,this.field.width,this.field.height),"velocityVector" : new Vector(random(-3,3),random(-3,3)), "color" : (function(){var rand = Math.random(); return (rand<0.33)?"#FF00C3":(rand<0.66)?"#00FF26":"#00FBFF";})()})
    var added = this.addBall(ball);
    while (!added){
        ball.position = new randomPoint(0,0,this.field.width,this.field.height);
        added = this.addBall(ball);
    }
};

Game.prototype.setSpeed = function (newSpeed){
    if (newSpeed < 1 || newSpeed > 10){
        return;
    }
    var speedEvolution = newSpeed/this.speed;
    console.log('Speed from ' + this.speed + ' to ' + newSpeed + '(' + speedEvolution + ')');

    this.modifySpeed(speedEvolution);

    this.speed = newSpeed;
};

Game.prototype.modifySpeed = function (speedVariation) {

    for(var i = 0 ; i < this.balls.length ; ++i){
        this.balls[i].velocityVector = this.balls[i].velocityVector.times(speedVariation);
    }

}

Game.prototype.toString = function(){
    var str = 'Game : ';
    for(var i = 0; i<this.balls.length ; ++i ){
        str+= this.balls[i].position;
    }
    return str;
};

module.exports = Game;