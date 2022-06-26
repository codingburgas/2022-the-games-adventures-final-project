//Returns ared drawing context on the canvas
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

const playerImage = new Image();
playerImage.src = 'gameImages/playerImage.png';
const mushroomImage = new Image();
mushroomImage.src = 'gameImages/mushroomImage.png';
const smallRockImage = new Image();
smallRockImage.src = 'gameImages/smallRock.png';
const bigRockImage = new Image();
bigRockImage.src = 'gameImages/bigRock.png';

class Player {
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.jumpHeight = 13;
        //These 3 are used for jump configuration
        this.shouldJump = false;
        this.jumpCounter = 0;
        this.jumpUp = true;
    }

    draw() {
        this.jump();
        ctx.drawImage(playerImage,this.x - 60,this.y - 137,this.size * 3.5, this.size * 4)
    }

    jump() {
        if(this.shouldJump){
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
                //End the cycle
            if(this.jumpCounter >= 32){
                //Reset spin ready for another jump
                this.shouldJump = false;
            }
        }    
    }
}

class AvoidBlock {
    constructor(height, width, speed){
        this.height = height;
        this.width = width;
        this.x = canvas.width + width;
        this.y = 500 - height;
        this.slideSpeed = speed;
    }

    draw() {
        if(this.height > 60)
        {
            ctx.drawImage(mushroomImage,this.x - this.width + 10 ,this.y  - this.height + 20,this.width * 2.5, this.height * 2.5)
        }
        else if(this.height <= 60 && this.width > 50)
        {
            ctx.drawImage(bigRockImage,this.x - this.width + 26 ,this.y  - this.height + 31,this.width * 2, this.height * 2)
        }
        else if(this.height <= 60 && this.width <= 50)
        {
            ctx.drawImage(smallRockImage,this.x - this.width + 22.5 ,this.y  - this.height + 38,this.width * 2, this.height * 2)
        }
        
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
    
}

function startGame() {
    //Allocate memory via function call
    player = new Player(150,450,50);
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
    ctx.fillText(scoreString, 580 - xOffset, 100);
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

let movementSpeed = 0;

function backgroundMovement(){
    if(enemySpeed == 5)
    {
        movementSpeed = movementSpeed - 1.20; 
    }
    else
    {
        movementSpeed = movementSpeed - 1.20 - (0.24 * (enemySpeed- 5));
    }

    document.getElementById("canvas").style.backgroundPosition = movementSpeed + "px";
}
backgroundID = setInterval(backgroundMovement,1);

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
    backgroundID = setInterval(backgroundMovement,1);
}