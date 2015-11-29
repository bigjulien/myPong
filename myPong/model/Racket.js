/**
 * Created by tom on 29/11/15.
 */


var Ball = require('../model/Ball.js');
var Point = require('../model/Point.js');
var Vector = require('../model/Vector.js');

function Racket(xPos, yPos, params){
    if(!params){
        params = {};
    }
    this.size  = params.size || 25;
    this.depth = params.depth || 5;
    this.player = params.player || 'default';
    this.ball = new Ball({ "name": 'racket', "radius" : 50, "mass" : 9999, "position" : new Point(xPos,yPos),"velocityVector" : new Vector(0,0), "color" : '#F00'})
}

module.exports = Racket;