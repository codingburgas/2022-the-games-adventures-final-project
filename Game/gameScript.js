const canvas = document.getElementById("canvas");
const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

//Returns a drawing context on the canvas
const ctx = canvas.getContext('2d');

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