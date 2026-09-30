const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(window.innerWidth - 20, 420);
canvas.height = 550;

// ================= IMAGES =================

let planeImg = new Image();
planeImg.src = "assets/images/plane.png";

let enemyPlaneImg = new Image();
enemyPlaneImg.src = "assets/images/enemyPlane.png";

// ================= SOUNDS =================

let shootSound =
  new Audio("assets/sounds/shoot.mp3");

let crashSound =
  new Audio("assets/sounds/crash.mp3");

let pointSound =
  new Audio("assets/sounds/point.mp3");

// ================= VARIABLES =================

let player;
let bullets;
let enemies;

let score;
let lives;

let enemySpeed;
let spawnRate;

let gameLoop;

// ================= START GAME =================

function startGame(){

  document.getElementById("startScreen")
    .style.display = "none";

  document.getElementById("gameUI")
    .style.display = "block";

  let diff =
    document.getElementById("difficulty").value;

  // difficulty
  if(diff==="easy"){

    enemySpeed = 2;
    spawnRate = 0.008;
    lives = 5;
  }

  else if(diff==="medium"){

    enemySpeed = 3;
    spawnRate = 0.012;
    lives = 3;
  }

  else{

    enemySpeed = 4;
    spawnRate = 0.016;
    lives = 2;
  }

  player = {

    x:160,
    y:430,

    w:100,
    h:100
  };

  bullets = [];
  enemies = [];

  score = 0;

  clearInterval(gameLoop);

  gameLoop = setInterval(update,20);

  updateUI();
}

// ================= UPDATE =================

function update(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  // ================= BACKGROUND =================

  ctx.fillStyle = "black";
  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // stars
  for(let i=0;i<50;i++){

    ctx.fillStyle = "white";

    ctx.fillRect(

      Math.random()*canvas.width,

      Math.random()*canvas.height,

      2,
      2
    );
  }

  // ================= DYNAMIC DIFFICULTY =================

  let dynamicSpeed =
    enemySpeed + (score * 0.08);

  if(dynamicSpeed > 8){

    dynamicSpeed = 8;
  }

  let dynamicSpawn =
    spawnRate + (score * 0.00008);

  if(dynamicSpawn > 0.03){

    dynamicSpawn = 0.03;
  }

  // ================= PLAYER =================

  ctx.drawImage(

    planeImg,

    player.x,
    player.y,

    player.w,
    player.h
  );

  // ================= BULLETS =================

  for(let i=0;i<bullets.length;i++){

    let b = bullets[i];

    b.y -= 18;

    // futuristic bullet
    ctx.fillStyle = "cyan";

    ctx.shadowBlur = 20;

    ctx.shadowColor = "cyan";

    ctx.fillRect(
      b.x,
      b.y,
      6,
      25
    );

    ctx.shadowBlur = 0;

    // remove
    if(b.y < -30){

      bullets.splice(i,1);

      i--;
    }
  }

  // ================= ENEMY SPAWN =================

  if(Math.random() < dynamicSpawn){

    enemies.push({

      x:Math.random()*(canvas.width-80),

      y:-100,

      w:85,
      h:85
    });
  }

  // ================= ENEMIES =================

  for(let i=0;i<enemies.length;i++){

    let e = enemies[i];

    e.y += dynamicSpeed;

    ctx.drawImage(

      enemyPlaneImg,

      e.x,
      e.y,

      e.w,
      e.h
    );

    // ================= ENEMY PASSED =================

    if(e.y > canvas.height){

      enemies.splice(i,1);

      lives--;

      updateUI();

      if(lives <= 0){

        gameOver();
        return;
      }

      i--;
      continue;
    }

    // ================= BULLET COLLISION =================

    for(let j=0;j<bullets.length;j++){

      let b = bullets[j];

      if(

        b.x < e.x + e.w &&
        b.x + 6 > e.x &&

        b.y < e.y + e.h &&
        b.y + 25 > e.y
      ){

        pointSound.currentTime = 0;
        pointSound.play();

        // explosion effect
        ctx.beginPath();

        ctx.arc(

          e.x + 40,
          e.y + 40,

          35,

          0,
          Math.PI * 2
        );

        ctx.fillStyle = "orange";

        ctx.shadowBlur = 40;

        ctx.shadowColor = "red";

        ctx.fill();

        ctx.shadowBlur = 0;

        enemies.splice(i,1);

        bullets.splice(j,1);

        score++;

        updateUI();

        i--;

        break;
      }
    }

    // ================= PLAYER COLLISION =================

    if(

      player.x < e.x + e.w &&
      player.x + player.w > e.x &&

      player.y < e.y + e.h &&
      player.y + player.h > e.y
    ){

      crashSound.currentTime = 0;
      crashSound.play();

      // explosion
      ctx.beginPath();

      ctx.arc(

        e.x + 40,
        e.y + 40,

        45,

        0,
        Math.PI * 2
      );

      ctx.fillStyle = "red";

      ctx.shadowBlur = 50;

      ctx.shadowColor = "orange";

      ctx.fill();

      ctx.shadowBlur = 0;

      enemies.splice(i,1);

      lives--;

      updateUI();

      if(lives <= 0){

        gameOver();
        return;
      }

      i--;
    }
  }
}

// ================= SHOOT =================

function shoot(){

  shootSound.currentTime = 0;

  shootSound.play();

  bullets.push({

    x:player.x + 47,

    y:player.y
  });
}

// ================= KEYBOARD =================

document.addEventListener("keydown",(e)=>{

  if(e.key==="ArrowLeft"){

    player.x -= 30;
  }

  if(e.key==="ArrowRight"){

    player.x += 30;
  }

  if(e.key===" "){

    shoot();
  }

  // boundaries
  if(player.x < 0){

    player.x = 0;
  }

  if(player.x > canvas.width-player.w){

    player.x =
      canvas.width-player.w;
  }
});

// ================= MOBILE =================

function moveLeft(){

  player.x -= 30;

  if(player.x < 0){

    player.x = 0;
  }
}

function moveRight(){

  player.x += 30;

  if(player.x > canvas.width-player.w){

    player.x =
      canvas.width-player.w;
  }
}

function mobileShoot(){

  shoot();
}

// ================= UI =================

function updateUI(){

  document.getElementById("score")
    .innerText =
    "Score: " + score;

  let hearts = "";

  for(let i=0;i<lives;i++){

    hearts += "❤️ ";
  }

  document.getElementById("lives")
    .innerHTML = hearts;
}

// ================= GAME OVER =================

function gameOver(){

  clearInterval(gameLoop);

  alert(
    "🚀 Game Over!\nScore: " + score
  );

  saveScore(score,"Shooter");

  location.reload();
}

// ================= CONTROLS =================

function pauseGame(){

  clearInterval(gameLoop);
}

function resumeGame(){

  clearInterval(gameLoop);

  gameLoop =
    setInterval(update,20);
}

function restartGame(){

  location.reload();
}