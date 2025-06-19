import http from "http";
import {WebSocketServer} from "ws";

const server = http.createServer((req, res) => {
  res.end("Connected...");
});

// Create a websocket server
const wss = new WebSocketServer({server});

server.listen(8000, () => console.log("Server is running on port 8000..."));
