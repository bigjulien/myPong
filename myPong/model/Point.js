/**
 * Created by Tom on 17/08/2015.
 */


var Vector = require('../model/Vector.js');


//POINT
function Point(x,y){
    this.x = parseFloat(x);
    this.y = parseFloat(y);
}

Point.prototype.minus = function(otherPoint){
    var resultVect = new Vector();
    resultVect.x = this.x - otherPoint.x;
    resultVect.y = this.y - otherPoint.y;
    return resultVect;
};

Point.prototype.translate = function(vect){
    var resultPoint = new Point();
    resultPoint.x = this.x + vect.x;
    resultPoint.y = this.y + vect.y;
    return resultPoint;
};

Point.prototype.offset = function(xOffset, yOffset) {
    this.x += xOffset;
    this.y += yOffset;
};

Point.prototype.squareDistanceWith = function(otherPoint){
    var distX = otherPoint.x - this.x;
    distX *= distX;
    var distY = otherPoint.y - this.y ;
    distY *= distY;
    return distX + distY;
};

Point.prototype.distanceWith = function(otherPoint){
    return Math.sqrt(this.squareDistanceWith(otherPoint));
};

Point.prototype.toString = function(){
    return '(P:' + this.x + ',' + this.y + ')';
};


module.exports = Point ;