const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public")); // Serve static files

const expressServer = app.listen(8001);
const io = socketio(expressServer);

io.of("/").on("connection", (socket) => {
  // io.on("connection", (socket) => {
  console.log(socket.id + " connected");

  socket.join("room1");
  socket.join("room2");
  io.of("/").to("room1").emit("welcomeToRoom1", {});
  io.of("/").to("room1").to("room2").emit("welcomeToRoom1", {});
  socket.on("newMessageFromClient", (dataFromClient) => {
    io.emit("newMessageToClients", {message: dataFromClient.message}); // Sent to all sockets
  });
});

// rooms are namespace specific
io.of("/admin").on("connection", (socket) => {
  console.log(socket.id + " connected to admin");
  socket.join("room1");
  io.of("/admin").to("room1").emit("welcomeToRoom1", {});
});
