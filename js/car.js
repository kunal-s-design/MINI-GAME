const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

canvas.width =
  Math.min(window.innerWidth - 20, 420);

canvas.height = 650;

// ================= IMAGES =================

let playerImg = new Image();
playerImg.src =
  "assets/images/player.png";

let enemyImg = new Image();
enemyImg.src =
  "assets/images/enemy.png";

// ================= SOUNDS =================

let pointSound =
  new Audio("assets/sounds/point.mp3");

let crashSound =
  new Audio("assets/sounds/crash.mp3");

let shootSound =
  new Audio("assets/sounds/shoot.mp3");

// ================= VARIABLES =================

let player;

let enemies = [];

let bullets = [];

let score = 0;

let lives = 3;

let ammo = 10;

let fuel = 100;

let speed = 5;

let spawnRate = 0.015;

let gameLoop;

let roadOffset = 0;

let nitro = false;

// ================= START =================

function startGame(){

  document.getElementById(
    "startScreen"
  ).style.display = "none";

  document.getElementById(
    "gameUI"
  ).style.display = "block";

  let diff =
    document.getElementById(
      "difficulty"
    ).value;

  // difficulty
  if(diff==="easy"){

    speed = 4;

    spawnRate = 0.01;

    lives = 5;
  }

  else if(diff==="medium"){

    speed = 5;

    spawnRate = 0.015;

    lives = 3;
  }

  else{

    speed = 6;

    spawnRate = 0.02;

    lives = 2;
  }

  player = {

    x:160,

    y:500,

    w:90,

    h:120
  };

  enemies = [];

  bullets = [];

  score = 0;

  ammo = 10;

  fuel = 100;

  clearInterval(gameLoop);

  gameLoop =
    setInterval(update,20);

  updateUI();
}

// ================= UPDATE =================

function update(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // ================= ROAD =================

  ctx.fillStyle = "#222";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // road side
  ctx.fillStyle = "green";

  ctx.fillRect(
    0,
    0,
    40,
    canvas.height
  );

  ctx.fillRect(
    canvas.width-40,
    0,
    40,
    canvas.height
  );

  // moving road lines
  ctx.strokeStyle = "white";

  ctx.lineWidth = 6;

  ctx.setLineDash([30,25]);

  roadOffset += speed;

  ctx.lineDashOffset = -roadOffset;

  // left line
  ctx.beginPath();

  ctx.moveTo(140,0);

  ctx.lineTo(140,canvas.height);

  ctx.stroke();

  // right line
  ctx.beginPath();

  ctx.moveTo(280,0);

  ctx.lineTo(280,canvas.height);

  ctx.stroke();

  // ================= DYNAMIC DIFFICULTY =================

  let dynamicSpeed =
    speed + (score * 0.03);

  if(dynamicSpeed > 11){

    dynamicSpeed = 11;
  }

  let dynamicSpawn =
    spawnRate + (score * 0.00003);

  if(dynamicSpawn > 0.03){

    dynamicSpawn = 0.03;
  }

  // ================= FUEL =================

  fuel -= 0.02;

  if(fuel <= 0){

    fuel = 0;

    gameOver();
  }

  // ================= PLAYER =================

  ctx.shadowBlur = 20;

  ctx.shadowColor = "cyan";

  ctx.drawImage(

    playerImg,

    player.x,
    player.y,

    player.w,
    player.h
  );

  ctx.shadowBlur = 0;

  // ================= NITRO EFFECT =================

  if(nitro){

    ctx.fillStyle = "orange";

    ctx.shadowBlur = 30;

    ctx.shadowColor = "yellow";

    ctx.fillRect(

      player.x + 35,

      player.y + 110,

      20,

      40
    );

    ctx.shadowBlur = 0;
  }

  // ================= BULLETS =================

  for(let i=0;i<bullets.length;i++){

    let b = bullets[i];

    b.y -= 16;

    // neon bullet
    ctx.fillStyle = "cyan";

    ctx.shadowBlur = 20;

    ctx.shadowColor = "cyan";

    ctx.fillRect(

      b.x,
      b.y,

      8,
      25
    );

    ctx.shadowBlur = 0;

    if(b.y < -30){

      bullets.splice(i,1);

      i--;
    }
  }
    // ================= SPAWN ENEMIES =================

  if(Math.random() < dynamicSpawn){

    // proper lane system
    let lanes = [60,160,260];

    let randomLane =
      lanes[
        Math.floor(
          Math.random()*lanes.length
        )
      ];

    enemies.push({

      x:randomLane,

      y:-150,

      w:90,

      h:120
    });
  }

  // ================= ENEMIES =================

  for(let i=0;i<enemies.length;i++){

    let e = enemies[i];

    e.y += dynamicSpeed;

    ctx.shadowBlur = 20;

    ctx.shadowColor = "red";

    ctx.drawImage(

      enemyImg,

      e.x,
      e.y,

      e.w,
      e.h
    );

    ctx.shadowBlur = 0;

    // ================= BULLET COLLISION =================

    for(let j=0;j<bullets.length;j++){

      let b = bullets[j];

      if(

        b.x < e.x + e.w &&
        b.x + 8 > e.x &&

        b.y < e.y + e.h &&
        b.y + 25 > e.y
      ){

        pointSound.currentTime = 0;

        pointSound.play();

        // explosion
        ctx.beginPath();

        ctx.arc(

          e.x + 45,
          e.y + 45,

          45,

          0,
          Math.PI * 2
        );

        ctx.fillStyle = "orange";

        ctx.shadowBlur = 50;

        ctx.shadowColor = "red";

        ctx.fill();

        ctx.shadowBlur = 0;

        enemies.splice(i,1);

        bullets.splice(j,1);

        score += 2;

        updateUI();

        i--;

        break;
      }
    }

    // ================= PLAYER COLLISION =================

    if(

      player.x < e.x + e.w - 20 &&
      player.x + player.w - 20 > e.x &&

      player.y < e.y + e.h - 20 &&
      player.y + player.h - 20 > e.y
    ){

      crashSound.currentTime = 0;

      crashSound.play();

      // explosion
      ctx.beginPath();

      ctx.arc(

        e.x + 45,
        e.y + 45,

        55,

        0,
        Math.PI * 2
      );

      ctx.fillStyle = "red";

      ctx.shadowBlur = 60;

      ctx.shadowColor = "orange";

      ctx.fill();

      ctx.shadowBlur = 0;

      // screen shake
      canvas.style.transform =
        "translateX(8px)";

      setTimeout(()=>{

        canvas.style.transform =
          "translateX(0px)";

      },100);

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

    // ================= PASSED =================

    if(e.y > canvas.height){

      enemies.splice(i,1);

      pointSound.currentTime = 0;

      pointSound.play();

      score++;

      // reward bullets
      ammo += 2;

      if(ammo > 30){

        ammo = 30;
      }

      // fuel reward
      fuel += 5;

      if(fuel > 100){

        fuel = 100;
      }

      updateUI();

      i--;
    }
  }

  // ================= SPEED DISPLAY =================

  document.getElementById(
    "speed"
  ).innerText =
    "Speed: " +
    Math.floor(dynamicSpeed * 20);

}

// ================= SHOOT =================

function shoot(){

  if(ammo <= 0){

    return;
  }

  ammo--;

  shootSound.currentTime = 0;

  shootSound.play();

  bullets.push({

    x:player.x + 42,

    y:player.y
  });

  updateUI();
}

// ================= NITRO =================

function nitroBoost(){

  if(!nitro){

    nitro = true;

    speed += 3;

    setTimeout(()=>{

      nitro = false;

      speed -= 3;

    },3000);
  }
}

// ================= KEYBOARD =================

document.addEventListener(
  "keydown",
  (e)=>{

  if(e.key==="ArrowLeft"){

    player.x -= 40;
  }

  if(e.key==="ArrowRight"){

    player.x += 40;
  }

  if(e.key===" "){

    shoot();
  }

  if(e.key==="Shift"){

    nitroBoost();
  }

  // boundaries
  if(player.x < 45){

    player.x = 45;
  }

  if(player.x > 285){

    player.x = 285;
  }
});

// ================= MOBILE =================

function moveLeft(){

  player.x -= 40;

  if(player.x < 45){

    player.x = 45;
  }
}

function moveRight(){

  player.x += 40;

  if(player.x > 285){

    player.x = 285;
  }
}

// ================= UI =================

function updateUI(){

  document.getElementById(
    "score"
  ).innerText =
    "Score: " + score;

  let hearts = "";

  for(let i=0;i<lives;i++){

    hearts += "❤️ ";
  }

  document.getElementById(
    "lives"
  ).innerHTML = hearts;

  document.getElementById(
    "ammo"
  ).innerText =
    "Ammo: " + ammo;

  document.getElementById(
    "fuel"
  ).innerText =
    "Fuel: " +
    Math.floor(fuel) + "%";
}

// ================= GAME OVER =================

function gameOver(){

  clearInterval(gameLoop);

  alert(

    "🏁 GAME OVER\n\n" +

    "Score: " + score
  );

  saveScore(score,"Car");

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