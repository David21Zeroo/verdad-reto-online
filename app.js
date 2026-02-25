const socket = io("https://verdad-reto-online-4.onrender.com");

let currentRoom = "";
let playerName = "";

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
  document.getElementById("turn").innerText =
    "Turno de: " + room.players[room.turn]?.name;

  document.getElementById("challengeBox").innerText =
    room.challenge || "Esperando reto...";
});

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
