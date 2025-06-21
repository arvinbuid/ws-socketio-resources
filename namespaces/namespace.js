const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public")); // Serve static files

const expressServer = app.listen(8001);
const io = socketio(expressServer);

io.of("/").on("connection", (socket) => {
  // io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  socket.on("newMessageFromClient", (dataFromClient) => {
    io.emit("newMessageToClients", {message: dataFromClient.message}); // Sent to all sockets
  });
});

io.of("/admin").on("connection", (socket) => {
  // io.on("connection", (socket) => {
  console.log(socket.id + " connected to admin");
});
