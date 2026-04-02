const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  players[socket.id] = {
    x: 50,
    y: Math.random() * 400 + 50
  };

  socket.on("move", (data) => {
    let player = players[socket.id];
    if (!player) return;

    // Simple movement validation (anti-cheat)
    const speed = 5;

    if (data === "RIGHT") player.x += speed;
    if (data === "LEFT") player.x -= speed;
    if (data === "UP") player.y -= speed;
    if (data === "DOWN") player.y += speed;
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    console.log("Player disconnected:", socket.id);
  });
});

// Send updates 60 times/sec
setInterval(() => {
  io.sockets.emit("state", players);
}, 1000 / 60);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running");
});
