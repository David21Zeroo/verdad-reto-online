const socket = io("https://TU-URL-RENDER.onrender.com"); // 👈 CAMBIA ESTO

let currentRoom = "";
let playerName = "";
let timerInterval = null;

const truths = [
"¿Cuál ha sido tu mayor vergüenza?",
"¿Te gusta alguien en secreto?",
"¿Cuál es tu miedo más grande?"
];

const dares = [
"Haz 10 flexiones",
"Canta una canción 15 segundos",
"Baila sin música 20 segundos"
];

function randomItem(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function createRoom(){
  playerName = document.getElementById("name").value;
  if(!playerName) return alert("Escribe tu nombre");

  socket.emit("createRoom",{name:playerName},(code)=>{
    currentRoom = code;
    document.getElementById("roomInfo").innerHTML="Código: <b>"+code+"</b>";
    document.getElementById("game").style.display="block";
  });
}

function joinRoom(){
  const code = document.getElementById("code").value;
  playerName = document.getElementById("name").value;

  if(!code || !playerName) return alert("Completa los datos");

  socket.emit("joinRoom",{code,name:playerName},(res)=>{
    if(res==="OK"){
      currentRoom = code;
      document.getElementById("game").style.display="block";
    }else{
      alert(res);
    }
  });
}

socket.on("updateRoom",(room)=>{
  if(room.players.length > 0){
    document.getElementById("turn").innerText =
      "Turno de: " + room.players[room.turn]?.name;
  }
});

function showChallenge(text){
  document.getElementById("challengeBox").innerText = text;
  startTimer();
}

function startTimer(){
  let time = 20;
  const timer = document.getElementById("timer");
  timer.innerText = time;

  if(timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(()=>{
    time--;
    timer.innerText = time;

    if(time<=0){
      clearInterval(timerInterval);
      socket.emit("nextTurn",currentRoom);
    }
  },1000);
}

document.addEventListener("DOMContentLoaded",()=>{

  document.querySelector(".green").onclick=()=>{
    showChallenge("VERDAD: "+randomItem(truths));
  };

  document.querySelector(".red").onclick=()=>{
    showChallenge("RETO: "+randomItem(dares));
  };

});

// CHAT
function sendMessage(){
  const input = document.getElementById("chatInput");
  const message = input.value;

  if(!message) return;

  socket.emit("sendMessage",{
    code: currentRoom,
    name: playerName,
    message
  });

  input.value="";
}

socket.on("receiveMessage",(data)=>{
  const chat = document.getElementById("chatBox");

  const msg = document.createElement("div");
  msg.innerHTML = "<b>"+data.name+":</b> "+data.message;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
});
