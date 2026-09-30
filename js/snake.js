let heartImg = new Image();
heartImg.src = "assets/images/heart.png";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(window.innerWidth - 20, 400);
canvas.height = 400;

let snake;
let food;
let direction;
let score;
let lives;
let speed;
let gameLoop;

// sounds
let eatSound = new Audio("assets/sounds/point.mp3");
let gameOverSound = new Audio("assets/sounds/crash.mp3");

// start game
function startGame(){

  document.getElementById("startScreen").style.display="none";
  document.getElementById("gameUI").style.display="block";

  let diff = document.getElementById("difficulty").value;

  if(diff==="easy"){
    speed = 170;
    lives = 5;
  }
  else if(diff==="medium"){
    speed = 120;
    lives = 3;
  }
  else{
    speed = 80;
    lives = 2;
  }

  snake = [{x:200,y:200}];

  direction = "RIGHT";

  score = 0;

  spawnFood();

  clearInterval(gameLoop);

  gameLoop = setInterval(draw, speed);

  updateUI();
}

// food
function spawnFood(){
  food = {
    x: Math.floor(Math.random()*20)*20,
    y: Math.floor(Math.random()*20)*20
  };
}

// draw
function draw(){

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  moveSnake();

  // food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);

  // snake
  ctx.fillStyle = "lime";

  snake.forEach(part=>{
    ctx.fillRect(part.x, part.y, 20, 20);
  });

  updateUI();
}

// move
function moveSnake(){

  let head = {...snake[0]};

  if(direction==="UP") head.y -= 20;
  if(direction==="DOWN") head.y += 20;
  if(direction==="LEFT") head.x -= 20;
  if(direction==="RIGHT") head.x += 20;

  // wall collision
  if(
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    collision(head)
  ){

    lives--;

    if(lives <= 0){
      gameOver();
      return;
    }

    snake = [{x:200,y:200}];
    direction = "RIGHT";

    return;
  }

  snake.unshift(head);

  // eat
  if(head.x===food.x && head.y===food.y){

    eatSound.currentTime = 0;
    eatSound.play();

    score++;

    spawnFood();
  }
  else{
    snake.pop();
  }
}

// collision
function collision(head){

  for(let i=1;i<snake.length;i++){

    if(
      head.x===snake[i].x &&
      head.y===snake[i].y
    ){
      return true;
    }
  }

  return false;
}

// keyboard
document.addEventListener("keydown", e=>{

  if(e.key==="ArrowUp" && direction!=="DOWN")
    direction="UP";

  if(e.key==="ArrowDown" && direction!=="UP")
    direction="DOWN";

  if(e.key==="ArrowLeft" && direction!=="RIGHT")
    direction="LEFT";

  if(e.key==="ArrowRight" && direction!=="LEFT")
    direction="RIGHT";
});

// mobile buttons
function setDirection(dir){

  if(dir==="UP" && direction!=="DOWN")
    direction="UP";

  if(dir==="DOWN" && direction!=="UP")
    direction="DOWN";

  if(dir==="LEFT" && direction!=="RIGHT")
    direction="LEFT";

  if(dir==="RIGHT" && direction!=="LEFT")
    direction="RIGHT";
}

// ui
function updateUI(){

  document.getElementById("score").innerText =
    "Score: " + score;

  let hearts = "";

  for(let i=0;i<lives;i++){
    hearts += "❤️ ";
  }

  document.getElementById("lives").innerHTML = hearts;
}

// game over
function gameOver(){

  clearInterval(gameLoop);

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  alert("Game Over! Score: " + score);

  saveScore(score, "Snake");

  location.reload();
}

// controls
function pauseGame(){
  clearInterval(gameLoop);
}

function resumeGame(){

  clearInterval(gameLoop);

  gameLoop = setInterval(draw, speed);
}

function restartGame(){
  location.reload();
}