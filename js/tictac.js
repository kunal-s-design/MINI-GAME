let winSound = new Audio("assets/sounds/win.mp3");

let buttonSound = new Audio("assets/sounds/button.mp3");
let board = [];
let currentPlayer = "X";
let gameActive = true;
let mode = "computer";

// start
function startGame(){

  document.getElementById("startScreen").style.display="none";

  document.getElementById("gameUI").style.display="block";

  mode = document.getElementById("mode").value;

  board = ["","","","","","","","",""];

  currentPlayer = "X";

  gameActive = true;

  renderBoard();

  updateStatus();
}

// render
function renderBoard(){

  const boardDiv =
    document.getElementById("board");

  boardDiv.innerHTML = "";

  for(let i=0;i<9;i++){

    let cell =
      document.createElement("div");

    cell.classList.add("cell");

    cell.innerText = board[i];

    cell.onclick = ()=>makeMove(i);

    boardDiv.appendChild(cell);
  }
}

// move
function makeMove(index){
buttonSound.currentTime = 0;
buttonSound.play();
  if(
    board[index] !== "" ||
    !gameActive
  ){
    return;
  }

  board[index] = currentPlayer;

  renderBoard();

  if(checkWinner()){

    document.getElementById("status")
      .innerText =
      "🎉 Player " + currentPlayer + " Wins!";

    gameActive = false;

    return;
  }

  if(board.every(c=>c!=="")){

    document.getElementById("status")
      .innerText =
      "🤝 Draw!";

    gameActive = false;

    return;
  }

  // switch player
  currentPlayer =
    currentPlayer==="X" ? "O" : "X";

  updateStatus();

  // computer move
  if(
    mode==="computer" &&
    currentPlayer==="O" &&
    gameActive
  ){

    setTimeout(computerMove,500);
  }
}

// computer
function computerMove(){

  let empty = [];

  for(let i=0;i<9;i++){

    if(board[i]===""){
      empty.push(i);
    }
  }

  if(empty.length===0) return;

  let random =
    empty[Math.floor(Math.random()*empty.length)];

  makeMove(random);
}

// winner
winSound.play();
function checkWinner(){

  const wins = [
    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
  ];

  for(let w of wins){

    let [a,b,c] = w;

    if(
      board[a] &&
      board[a]===board[b] &&
      board[a]===board[c]
    ){
      return true;
    }
  }

  return false;
}

// status
function updateStatus(){

  document.getElementById("status")
    .innerText =
    "Player " + currentPlayer + " Turn";
}

// restart
function restartGame(){
  location.reload();
}