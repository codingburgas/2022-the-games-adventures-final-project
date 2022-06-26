//Returns a drawing context on the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

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
        this.spinIncrement = 90 / 32;
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
    constructor(width, height, speed){
        this.height = height;
        this.width = width;
        this.x = canvas.width + width;
        this.y = 400 - height;
        this.color = "red";
        this.slideSpeed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
}

function startGame() {
    //Allocate memory via function call
    player = new Player(150,350,50);
    arrayBlocks = [];
    //Initial score number
    score = 0;
    //Speed of red blocks increases
    scoreIncrement = 0;
    //Speed of red blocks
    enemySpeed = 5;
    //How often red blocks appear
    presetTime = 1300;
}

function getRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//Returns true of colliding
function playerColliding(player,block){
    let playerObj = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let enemyObj = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    //Don't need pixel perfect collision detection
    playerObj.size= playerObj.size - 10;
    enemyObj.width = enemyObj.width - 10;
    enemyObj.height = enemyObj.height - 10;
    enemyObj.x = enemyObj.x + 10;
    enemyObj.y = enemyObj.y + 10;
    return !(
        playerObj.x>enemyObj.x+enemyObj.width || 
        //player is to the right of enemy
        playerObj.x+playerObj.size<enemyObj.x || 
        //player to the left of enemy
        playerObj.y+playerObj.size<enemyObj.y 
        //player is above enemy
    )
}

//Returns true if past player past block
function isPastBlock(player, block){
    return(
        player.x + (player.size / 2) > block.x + (block.width / 4) && 
        player.x + (player.size / 2) < block.x + (block.width / 4) * 3
    )
}


//Auto generate blocks
function generateBlocks() {
    let timeDelay = randomInterval(presetTime);
    arrayBlocks.push(new AvoidBlock(getRandomNumber(50, 80),getRandomNumber(45, 60), enemySpeed));
    setTimeout(generateBlocks, timeDelay);
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

function drawScore() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let scoreString = score.toString();
    let xOffset = ((scoreString.length - 1) * 20);
    ctx.fillText(scoreString, 280 - xOffset, 100);
}


function shouldIncreaseSpeed() {
    //Check to see if game speed should be increased
    if(scoreIncrement + 15 === score){
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
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Canvas Logic
    drawScore();
    //Foreground
    player.draw();
    //Check to see if game speed should be increased
    shouldIncreaseSpeed();

    arrayBlocks.forEach((arrayBlock, index) => {
        arrayBlock.slide();
        
        //End game as player and enemy have collided
        if(playerColliding(player, arrayBlock)){
            cardScore.textContent = score;
            card.style.display = "block";
            cancelAnimationFrame(animationId);
            clearInterval(backgroundID);
        }
        //User should score a point if this is the case
        if(isPastBlock(player, arrayBlock) && canScore){
            canScore = false;
            score++;
        }

        //Delete block that has left the screen
        if((arrayBlock.x + arrayBlock.width) <= 0){
            setTimeout(() => {
                arrayBlocks.splice(index, 1);
            }, 0)
        }
    });
}

//Call first time on document load
startGame();
animate();
setTimeout(() => {
    generateBlocks();
}, randomInterval(presetTime))

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

//Restart game
function restartGame(button) {
    card.style.display = "none";
    button.blur();
    startGame();
    requestAnimationFrame(animate);
}