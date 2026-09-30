let scores =
  JSON.parse(localStorage.getItem("scores"))
  || [];

scores.sort((a,b)=>b.score-a.score);

const body =
  document.getElementById("leaderboardBody");

scores.forEach(s=>{

  body.innerHTML += `
    <tr>
      <td>${s.name}</td>
      <td>${s.game}</td>
      <td>${s.score}</td>
    </tr>
  `;
});

function clearLeaderboard(){

  localStorage.removeItem("scores");

  location.reload();
}