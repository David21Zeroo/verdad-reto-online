const socket = io("https://verdad-reto-online-1.onrender.com");

let currentRoom = "";

function createRoom(){
  socket.emit("createRoom",(code)=>{
    currentRoom = code;
    document.getElementById("roomInfo").innerText="Código: "+code;
  });
}

function joinRoom(){
  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  socket.emit("joinRoom",{code,name},(res)=>{
    if(res==="OK"){
      currentRoom=code;
      document.getElementById("game").style.display="block";
    }else{
      alert(res);
    }
  });
}

socket.on("updateRoom",(room)=>{
  document.getElementById("turn").innerText=
  "Turno de: "+room.players[room.turn]?.name;
});
