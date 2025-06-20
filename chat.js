import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import {Server} from "socket.io";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8001);

// io - the server object in socket.io docs
const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:8001",
  },
  transports: ["polling", "websocket"],
  cookie: {
    name: "my-cookie",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 86400, // 1 day
  },
});

io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  socket.on("newMessageFromClient", (dataFromClient) => {
    io.emit("newMessageToClients", {message: dataFromClient.message}); // Sent to all sockets
  });
});
