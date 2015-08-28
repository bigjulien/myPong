/**
 * Created by Tom on 17/08/2015.
 */
/**
 * Created by Tom Veniat on 19/07/2015.
 */
"use strict";

var bouncements = 0, collisions = 0 ;






var energySum = function (balls) {
    var sum = 0;
    for (var i = 0 ; i< balls.length ; ++i){
        sum+=balls[i].velocityVector.norm();
    }
    return sum;
};






