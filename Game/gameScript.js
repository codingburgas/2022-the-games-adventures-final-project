const canvas = document.getElementById("canvas");
const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

//Returns a drawing context on the canvas
const ctx = canvas.getContext('2d');

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