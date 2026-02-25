const socket = io("https://verdad-reto-online-1.onrender.com"); // 👈 CAMBIA POR TU URL REAL

let currentRoom = "";
let timerInterval = null;

const truths = [
"¿Cuál ha sido tu mayor vergüenza?",
"¿Te gusta alguien en secreto?",
"¿Cuál es tu miedo más grande?",
"¿Has mentido hoy?",
"¿Qué es lo más loco que has hecho?"
];

const dares = [
"Haz 10 flexiones",
"Canta una canción por 15 segundos",
"Habla con voz de bebé por 1 minuto",
"Baila sin música por 20 segundos",
"Envía un emoji extraño a alguien"
];

function randomItem(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function createRoom(){
  const name = document.getElementById("name").value;
  if(!name) return alert("Escribe tu nombre");

  socket.emit("createRoom",{name},(code)=>{
    currentRoom = code;
    document.getElementById("roomInfo").innerHTML = "Código: <b>"+code+"</b>";
    document.getElementById("game").style.display="block";
  });
}

function joinRoom(){
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;

  if(!code || !name) return alert("Completa los datos");

  socket.emit("joinRoom",{code,name},(res)=>{
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
  const box = document.getElementById("challengeBox");
  box.innerText = text;
  box.style.opacity = "0";
  setTimeout(()=>{ box.style.opacity = "1"; },100);
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

    if(time <= 0){
      clearInterval(timerInterval);
      socket.emit("nextTurn", currentRoom);
    }
  },1000);
}

document.addEventListener("DOMContentLoaded",()=>{

  document.querySelector(".green").addEventListener("click",()=>{
    showChallenge("VERDAD: " + randomItem(truths));
  });

  document.querySelector(".red").addEventListener("click",()=>{
    showChallenge("RETO: " + randomItem(dares));
  });

});
