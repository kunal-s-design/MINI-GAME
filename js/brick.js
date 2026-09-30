let heartImg = new Image();
heartImg.src = "assets/images/heart.png";

let winSound = new Audio("assets/sounds/win.mp3");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(window.innerWidth - 20, 400);
canvas.height = 500;

// variables
let paddle;
let ball;
let bricks;
let score;
let lives;
let speed;
let gameLoop;

// sounds
let hitSound = new Audio("assets/sounds/point.mp3");
let crashSound = new Audio("assets/sounds/crash.mp3");

// start
function startGame(){

  document.getElementById("startScreen").style.display="none";

  document.getElementById("gameUI").style.display="block";

  let diff =
    document.getElementById("difficulty").value;

  if(diff==="easy"){
    speed = 3;
    lives = 5;
  }
  else if(diff==="medium"){
    speed = 5;
    lives = 3;
  }
  else{
    speed = 7;
    lives = 2;
  }

  paddle = {
    x:150,
    y:460,
    w:100,
    h:15
  };

  ball = {
    x:200,
    y:300,
    r:10,
    dx:speed,
    dy:-speed
  };

  score = 0;

  // bricks
  bricks = [];

  for(let r=0;r<5;r++){

    for(let c=0;c<6;c++){

      bricks.push({
        x:c*60+20,
        y:r*35+30,
        w:50,
        h:20,
        status:true
      });
    }
  }

  clearInterval(gameLoop);

  gameLoop = setInterval(update,20);

  updateUI();
}

// update
function update(){

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // paddle
  ctx.fillStyle = "cyan";

  ctx.fillRect(
    paddle.x,
    paddle.y,
    paddle.w,
    paddle.h
  );

  // ball
  ctx.beginPath();

  ctx.arc(
    ball.x,
    ball.y,
    ball.r,
    0,
    Math.PI*2
  );

  ctx.fillStyle = "white";

  ctx.fill();

  // bricks
  let remaining = 0;

  bricks.forEach(b=>{

    if(b.status){

      remaining++;

      ctx.fillStyle = "orange";

      ctx.fillRect(
        b.x,
        b.y,
        b.w,
        b.h
      );

      // collision
      if(
        ball.x > b.x &&
        ball.x < b.x+b.w &&
        ball.y > b.y &&
        ball.y < b.y+b.h
      ){

        hitSound.currentTime = 0;
        hitSound.play();

        ball.dy *= -1;

        b.status = false;

        score++;
      }
    }
  });

  // WIN
  if(remaining===0){

    clearInterval(gameLoop);

    alert("🎉 You Win!");
    winSound.play();

    saveScore(score,"Brick");

    location.reload();

    return;
  }

  // move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // wall collision
  if(ball.x < 0 || ball.x > canvas.width)
    ball.dx *= -1;

  if(ball.y < 0)
    ball.dy *= -1;

  // paddle collision
  if(
    ball.y + ball.r > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x+paddle.w
  ){
    ball.dy *= -1;
  }

  // lose life
  if(ball.y > canvas.height){

    crashSound.currentTime = 0;
    crashSound.play();

    lives--;

    if(lives<=0){
      gameOver();
      return;
    }

    // reset ball
    ball.x = 200;
    ball.y = 300;
    ball.dx = speed;
    ball.dy = -speed;
  }

  updateUI();
}

// keyboard
document.addEventListener("keydown", e=>{

  if(e.key==="ArrowLeft"){
    paddle.x -= 30;
  }

  if(e.key==="ArrowRight"){
    paddle.x += 30;
  }

  // boundaries
  if(paddle.x < 0)
    paddle.x = 0;

  if(paddle.x > canvas.width-paddle.w)
    paddle.x = canvas.width-paddle.w;
});

// mobile
function moveLeft(){

  paddle.x -= 30;

  if(paddle.x < 0)
    paddle.x = 0;
}

function moveRight(){

  paddle.x += 30;

  if(paddle.x > canvas.width-paddle.w)
    paddle.x = canvas.width-paddle.w;
}

// ui
function updateUI(){

  document.getElementById("score").innerText =
    "Score: " + score;

  let hearts = "";

  for(let i=0;i<lives;i++){
    hearts += "❤️ ";
  }

  document.getElementById("lives").innerHTML =
    hearts;
}

// game over
function gameOver(){

  clearInterval(gameLoop);

  alert("Game Over! Score: " + score);

  saveScore(score,"Brick");

  location.reload();
}

// controls
function pauseGame(){
  clearInterval(gameLoop);
}

function resumeGame(){

  clearInterval(gameLoop);

  gameLoop = setInterval(update,20);
}

function restartGame(){
  location.reload();
}