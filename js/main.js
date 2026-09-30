let bgMusic =
  new Audio("assets/sounds/background.mp3");

bgMusic.loop = true;

document.addEventListener("click",()=>{

  bgMusic.play();

},{once:true});

function saveScore(score, game){

  let playerName =
    localStorage.getItem("playerName");

  if(!playerName){

    playerName =
      prompt("Enter Your Name");

    if(!playerName){
      playerName = "Player";
    }

    localStorage.setItem(
      "playerName",
      playerName
    );
  }

  let scores =
    JSON.parse(localStorage.getItem("scores"))
    || [];

  scores.push({
    name:playerName,
    game:game,
    score:score
  });

  localStorage.setItem(
    "scores",
    JSON.stringify(scores)
  );
}