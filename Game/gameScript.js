const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

//Returns a drawing context on the canvas
const ctx = document.getElementById("canvas").getContext('2d');

let player = null;
let score = 0;
//Used to see if user has scored another 10 points or not
let scoreIncrement = 0;
let arrayBlocks = [];
//Enemy can speed up when player has scored points at intervals of 10
let enemySpeed = 0;
//Blocks don't score more then one point at a time
let canScore = true;
let presetTime = 0;

class Player {
    constructor(x,y,size,color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.jumpHeight = 17;
        //These 3 are used for jump configuration
        this.shouldJump = false;
        this.jumpCounter = 0;
        this.jumpUp = true;
        //Related to spin animation
        this.spin = 0;
        //Get a perfect 90 degree rotation
        this.spinIncrement = 90 / 35;
    }

    draw() {
        this.jump();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
        //Reset the rotation so the rotation of other elements is not changed
        if(this.shouldJump) {
            this.counterRotation();
        } 
    }

    jump() {
        if(this.shouldJump) {
            this.jumpCounter++;
            if(this.jumpCounter < 15){
                //Go up
                this.y -= this.jumpHeight;
            }else if(this.jumpCounter > 14 && this.jumpCounter < 19){
                this.y += 0;
            }else if(this.jumpCounter < 33){
                //Come back down
                this.y += this.jumpHeight;
            }
            this.rotation();
            //End the cycle
            if(this.jumpCounter >= 32){
                //Reset spin ready for another jump
                this.counterRotation();
                this.spin = 0;
                this.shouldJump = false;
            }
        }    
    }
    

    rotation() {
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition,offsetYPosition);
        //Division is there to convert degrees into radians
        ctx.rotate(this.spin * Math.PI / 180);
        ctx.rotate(this.spinIncrement * Math.PI / 180 );
        ctx.translate(-offsetXPosition,-offsetYPosition);
        //4.5 because 90 / 20 (number of iterations in jump) is 4.5
        this.spin += this.spinIncrement;
    }

    counterRotation() {
        //This rotates the cube back to its origin so that it can be moved upwards properly
        let offsetXPosition = this.x + (this.size / 2);
        let offsetYPosition = this.y + (this.size / 2);
        ctx.translate(offsetXPosition,offsetYPosition);
        ctx.rotate(-this.spin * Math.PI / 180 );
        ctx.translate(-offsetXPosition,-offsetYPosition);
    }

}  

class AvoidBlock {
    constructor(size, speed){
        this.x = canvas.width + size;
        this.y = 400 - size;
        this.size = size;
        this.color = "red";
        this.slideSpeed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
}

function startGame() {
    //Allocate memory via function call
    player = new Player(150,350,50,"black");
    arrayBlocks = [];
    //Initial score number
    score = 0;
    //Speed of red blocks increases
    scoreIncrement = 0;
    //Speed of red blocks
    enemySpeed = 5;
    //How often red blocks appear
    presetTime = 1000;
}

//Returns true of colliding
function enemyMovement(player,block) {
    let enemies = Object.create(block);

    //Perfect collision detection
    enemies.size -= 5;
    enemies.x += 1;
    enemies.y -= 2;

    return !(
        //Player is to the right of enemy
        player.x>enemies.x+enemies.size ||
        //Player is above of enemy
        player.y+player.size<enemies.y ||
        //Player is to the left of enemy
        player.x+player.size<enemies.x 
    )
}

//Returns true if past player past block
function isPastBlock(player, block) {
    return(
        player.x + (player.size / 2) > block.x + (block.size / 4) &&
        player.x + (player.size / 2) < block.x + (block.size / 4) * 3
    )
}

//Auto generate blocks
function generateBlocks() {
    let timeDelay = randomInterval(presetTime);
    arrayBlocks.push(new AvoidBlock(50, enemySpeed));
    setTimeout(generateBlocks, timeDelay);
}

function getRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomInterval(timeInterval) {
    let returnTime = timeInterval;
    if(Math.random() < 0.5){
        returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
    }else{
        returnTime -= getRandomNumber(presetTime / 5, presetTime / 2);
    }
    return returnTime;
}

//Draw the ground line
function drawBackgroundLine() {
    //Set x and y coordinates - from
    ctx.moveTo(0,400);

    //Set x and y coordinates - to
    ctx.lineTo(800,400);
    
    ctx.lineWidth = 1.9;
    ctx.stroke();
}

function drawScore() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let scoreString = score.toString();
    let xOffset = ((scoreString.length - 1) * 20);
    ctx.fillText(scoreString, 375 - xOffset, 100);
}

function shouldIncreaseSpeed() {
    //Check to see if game speed should be increased
    if(scoreIncrement + 10 === score){
        scoreIncrement = score;
        enemySpeed++;
        presetTime >= 100 ? presetTime -= 100 : presetTime = presetTime / 2;
        //Update speed of existing blocks
        arrayBlocks.forEach(block => {
            block.slideSpeed = enemySpeed;
        });
    }
}

let animationId = null;

//Recursive function
function animate() {
    animationId = requestAnimationFrame(animate);
    //Clear previous action
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBackgroundLine();
    drawScore();
    //Foreground
    player.draw();
}

startGame();
animate();

//Event Listeners
addEventListener("keydown", e => {
    if(e.code === 'Space'){
        if(!player.shouldJump){
            player.jumpCounter = 0;
            player.shouldJump = true;
            canScore = true;
        }
    }
});