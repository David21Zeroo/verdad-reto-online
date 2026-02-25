const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const rooms = {};

function generateCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

io.on("connection", (socket) => {

  socket.on("createRoom", ({ name }, callback) => {
    const code = generateCode();

    rooms[code] = {
      players: [{ id: socket.id, name }],
      turn: 0
    };

    socket.join(code);
    callback(code);
    io.to(code).emit("updateRoom", rooms[code]);
  });

  socket.on("joinRoom", ({ code, name }, callback) => {
    if (!rooms[code]) return callback("Sala no existe");

    rooms[code].players.push({ id: socket.id, name });
    socket.join(code);

    io.to(code).emit("updateRoom", rooms[code]);
    callback("OK");
  });

  socket.on("nextTurn", (code) => {
    if (!rooms[code]) return;

    rooms[code].turn =
      (rooms[code].turn + 1) % rooms[code].players.length;

    io.to(code).emit("updateRoom", rooms[code]);
  });

  // 🔥 CHAT
  socket.on("sendMessage", ({ code, name, message }) => {
    if (!rooms[code]) return;

    io.to(code).emit("receiveMessage", {
      name,
      message
    });
  });

});

server.listen(3000, () => console.log("Servidor activo"));
