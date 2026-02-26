const socket = io("https://verdad-reto-online-4.onrender.com");

let currentRoom = "";
let playerNumber = 0;

const truths = [
"¿Cuál es tu secreto más grande?",
"¿Te gusta alguien aquí?",
"¿Cuál fue tu peor cita?"
];

const dares = [
"Envía un audio cantando.",
"Habla con voz graciosa por 1 minuto.",
"Cuenta un chiste malo."
];

function randomItem(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function createRoom(){
  const code = document.getElementById("roomInput").value;
  if(!code) return alert("Escribe un código");
  socket.emit("createRoom", code);
}

function joinRoom(){
  const code = document.getElementById("roomInput").value;
  if(!code) return alert("Escribe un código");
  socket.emit("joinRoom", code);
}

function sendTruth(){
  const challenge = "VERDAD: " + randomItem(truths);
  socket.emit("sendChallenge",{code:currentRoom, challenge});
}

function sendDare(){
  const challenge = "RETO: " + randomItem(dares);
  socket.emit("sendChallenge",{code:currentRoom, challenge});
}

function nextTurn(){
  socket.emit("nextTurn", currentRoom);
}

socket.on("roomCreated",(code)=>{
  currentRoom = code;
  playerNumber = 1;
  startGame(code);
});

socket.on("roomJoined",(code)=>{
  currentRoom = code;
  playerNumber = 2;
  startGame(code);
});

socket.on("updateTurn",(turn)=>{
  document.getElementById("turnText").innerText =
    turn === playerNumber ? "Es tu turno" : "Turno del jugador " + turn;
});

socket.on("receiveChallenge",(challenge)=>{
  document.getElementById("challengeText").innerText = challenge;
});

function startGame(code){
  document.getElementById("home").style.display="none";
  document.getElementById("gameArea").style.display="block";
  document.getElementById("roomTitle").innerText="Sala: "+code;
}
