const canvas = document.getElementById("canvas");
const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

//Returns a drawing context on the canvas
const ctx = canvas.getContext('2d');

//Draw the ground line
function drawBackgroundLine() {
    //Set x and y coordinates - from
    ctx.moveTo(0,400);

    //Set x and y coordinates - to
    ctx.lineTo(800,400);
    
    ctx.lineWidth = 1.9;
    ctx.stroke();
}

let animationId = null;

//Recursive function
function animate() {
    animationId = requestAnimationFrame(animate);

    //Clear previous action
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBackgroundLine();
}

animate();