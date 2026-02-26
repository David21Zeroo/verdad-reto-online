const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server,{cors:{origin:"*"}});

let rooms = {};

io.on("connection",(socket)=>{

  socket.on("createRoom",(code)=>{
    rooms[code] = {players:1, turn:1};
    socket.join(code);
    socket.emit("roomCreated",code);
  });

  socket.on("joinRoom",(code)=>{
    if(rooms[code] && rooms[code].players === 1){
      rooms[code].players++;
      socket.join(code);
      socket.emit("roomJoined",code);
      io.to(code).emit("updateTurn",1);
    }
  });

  socket.on("sendChallenge",({code,challenge})=>{
    io.to(code).emit("receiveChallenge",challenge);
  });

  socket.on("nextTurn",(code)=>{
    if(!rooms[code]) return;
    rooms[code].turn = rooms[code].turn === 1 ? 2 : 1;
    io.to(code).emit("updateTurn",rooms[code].turn);
  });

});

server.listen(process.env.PORT || 3000,()=>{
  console.log("Servidor activo");
});
