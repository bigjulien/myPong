/**
 * Created by Tom on 17/08/2015.
 */

var Point = require('../model/Point.js');

var bounceFunctions={
    "HORIZONTAL" : function (velocityVector) {
        velocityVector.x=-velocityVector.x;
        return velocityVector;
    },
    "VERTICAL" : function (velocityVector) {

        velocityVector.y=-velocityVector.y;
        return velocityVector;
    }
};

//BALL
/**
 * A Ball as :
 * - a position
 * - a radius
 * - a movement Vector
 * - a color
 * - a mass
 */
function Ball(params){
    if (!params) params={};
    this.name = params.name;
    this.radius = params.radius || random(20,50);
    this.position = params.position || randomPoint(100,100,1000,600);
    this.color = params.color || "#000";

    this.velocityVector = params.velocityVector || new Vector();
    this.mass = params.mass || this.radius;

}


Ball.prototype.willCollide = function(vect,ball) {

    //  var speed = this.velocityVector.minus(ball.velocityVector);
    //  alert(speed);
    // var oldspeed = this.velocityVector;
    //this.velocityVector = speed;
    //console.log(vect.norm() + ' <= '+ (this.position.distanceWith(ball.position) + ' - ' + this.radius + ' - '+ ball.radius));
    if (vect.norm() < (this.position.distanceWith(ball.position) - this.radius - ball.radius)) {
        //The ball will not go far enough to collide.
        return false
    }
    //alert(this.name +" might collide " + ball.name + " : " + String(vect.norm() + " > " + String(this.position.distanceWith(ball.position) - this.radius - ball.radius)));

    //the vector between this.position and ball.position
    var ab = ball.position.minus(this.position);
    if(ab.dot(vect) <= 0){
        //alert(this.name +" can't collide " + ball.name + " : " + String(ball.position.minus(this.position).dot(vect))  + " : Not Moving Toward.");
        //The ball isn't moving toward the other ball.
        return false
    }
    //console.log(vect.normalized()+' · ' + ab + ' : ' + vect.normalized().dot(ab) + " out of " + vect.norm())

    var minimumDistanceOnV = ab.dot(vect.normalized());
    //alert( this.name +" may collide " + ball.name + " : " + minimumDistanceOnV + " : Moving Toward.");

    var squareShortestDistance = ab.squareNorm() - (minimumDistanceOnV*minimumDistanceOnV);

    if(squareShortestDistance > Math.pow(this.radius+ball.radius,2)) {
        //alert(this.name + " can't collide " + ball.name + " : " + squareShortestDistance + " >" + Math.pow(this.radius + ball.radius, 2));
        //the  closest point to ball.position on vect is greater than the sum of the two radii.
        return false;
    }
    //alert(this.name + " can collide " + ball.name + " : " + squareShortestDistance + " <=" + Math.pow(this.radius + ball.radius, 2));

    var t = Math.pow(this.radius + ball.radius, 2)- squareShortestDistance;
    var distanceToDoOnItsVeloVect= minimumDistanceOnV-Math.sqrt(t);
    //alert(this.name + " have to do " + distanceToDoOnItsVeloVect + " on its velocity vecor (" + vect.norm() + ') to collide' + ball.name );

    if(distanceToDoOnItsVeloVect*distanceToDoOnItsVeloVect > vect.squareNorm()){
        //this can't move enought on its direction to collide ball
        return false;
    }

    //alert("BOUNCE");
    // vect = vect.normalized().multiplyScalar(distanceToDoOnItsVeloVect);

    // console.log(distanceToDoOnItsVeloVect + " on " + vect.norm() + " -> " + distanceToDoOnItsVeloVect/vect.norm());
    return distanceToDoOnItsVeloVect/vect.norm();
};

Ball.prototype.collides = function(otherBall){
    /*        return this.position.squareDistanceWith(otherBall.position) <= Math.pow(this.radius+otherBall.radius,2);
     if(!otherBall.position.minus(this.position).squareNorm() <= Math.pow(this.radius+otherBall.radius,2))
     return false;
     else return true;
     alert('COLLISION ' +otherBall.position.minus(this.position).squareNorm() + ' <= ' + Math.pow(this.radius+otherBall.radius,2) );
     */
    if (otherBall.position.minus(this.position).squareNorm() < Math.pow(this.radius+otherBall.radius,2)) {
        // alert('COLLISION ' +otherBall.position.minus(this.position).squareNorm() + ' <= ' + Math.pow(this.radius+otherBall.radius,2) );
        return true;
    }else{
        return false;
    }
};

Ball.prototype.computeNextPosition = function(){
    var moveX = this.velocityVector.x;
    var moveY = this.velocityVector.y;
    return new Point(this.position.x + moveX, this.position.y + moveY);
};

Ball.prototype.move = function(time) {
    this.position=this.computeNextPosition(time);
    return this;
};

Ball.prototype.bounce = function(dir) {
    this.velocityVector = bounceFunctions[dir](this.velocityVector);
};

Ball.prototype.collidesOneBall = function(otherBalls){
    for (var i = 0; i < otherBalls.length; ++i) {
        if(this.collides(otherBalls[i]))
            return true;
    }
    return false;
};

module.exports = Ball;