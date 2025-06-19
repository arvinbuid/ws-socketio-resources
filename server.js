import express from "express";
import path from "path";
import {fileURLToPath} from "url";
import {Server} from "socket.io";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public")); // Serve static files

const expressServer = app.listen(8000);
const io = new Server(expressServer);

io.on("connection", (socket) => {
  console.log(socket.id + " connected");
  socket.emit("fromServer", {data: "hello from the server"}); // emit custom event
  socket.on("fromClient", (data) => {
    console.log(data);
  });
});
