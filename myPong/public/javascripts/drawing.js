/**
 * Created by tom on 26/11/15.
 */
//DRAWING UTILS
function drawField(params, ctx){
    drawPlayground(params.field, ctx);
    drawRackets(params.rackets,ctx);
    drawBalls(params.balls, ctx);
}

function drawPlayground (params,ctx) {
    var width = params.width,
        height = params.height;
    ctx.clearRect(0,0,width,height);
    ctx.strokeStyle = "#7f7";
    ctx.lineWidth = 5;
    ctx.strokeRect(0,0,width,height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width/2,0);
    ctx.lineTo(width/2,height);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width/2,height/2,height*0.15,0,2*Math.PI);
    ctx.stroke();
    //left goal
    ctx.strokeRect(0,height*0.3, width*0.1, height*0.4);
    //right goal
    ctx.strokeRect(width ,height*0.3, -width*0.1, height*0.4);
}

function drawRackets(rackets,ctx){
    var racketBalls = [];
    for(var i =0 ; i < rackets.length ; ++i){
        racketBalls.push(rackets[i].ball);
    }
    drawBalls(racketBalls, ctx);
}


function drawBalls(balls, ctx){
    var ball, posX, posY;
    for (var i = 0; i < balls.length; ++i) {
        ball = balls[i];
        posX = ball.position.x;
        posY = ball.position.y;

        ctx.beginPath();
        //console.log("Drawing in : " + ball.color);
        ctx.fillStyle=ball.color;
        ctx.arc(posX,posY,ball.radius,0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle="#000";
        ctx.fillText(ball.name,posX,posY);
        //ctx.fillText("x:" + String((Math.round(ball.velocityVector.x*10)) /10) + " - y:" + String((Math.round(ball.velocityVector.y*10) )/10),posX,posY);
    }
    ctx.beginPath();
}