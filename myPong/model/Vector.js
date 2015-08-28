/**
 * Created by Tom on 17/08/2015.
 */


//VECTOR


function Vector(x,y){
    this.x = (typeof x != 'undefined')?parseFloat(x) : 1;
    this.y = (typeof x != 'undefined')?parseFloat(y) : 1;
}

Vector.prototype.add = function(vect){
    this.x+=vect.x;
    this.y+=vect.y;
};

Vector.prototype.minus = function(vect){
    var result = new Vector();
    result.x = this.x - vect.x;
    result.y = this.y - vect.y;
    return result;
};

Vector.prototype.dot = function(vect){
    return this.x * vect.x + this.y * vect.y ;
};

Vector.prototype.times = function(scalar){
    var result = new Vector();
    result.x = this.x * scalar;
    result.y = this.y * scalar;
    return result;
};
/*

 Vector.prototype.multiplyScalar = function(scalar){
 var vect = new Vector();
 vect.x = this.x * scalar;
 vect.y = this.y * scalar;
 return vect;
 };
 */

Vector.prototype.squareNorm = function(){
    return this.x * this.x + this.y * this.y;
};

Vector.prototype.norm = function(){
    return Math.sqrt(this.squareNorm());
};

Vector.prototype.normalized = function(){
    var normalizedVect = new Vector();
    var norm = this.norm();
    normalizedVect.x = this.x /norm;
    normalizedVect.y = this.y /norm;
    return normalizedVect;
};

Vector.prototype.toString = function(){
    return '(V:' + this.x + ',' + this.y + ')';
};

module.exports = Vector;