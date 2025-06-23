// server
const express = require("express");
const app = express();
const socketio = require("socket.io");

const namespaces = require("./data/namespaces");
const Room = require("./classes/Room");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// manufactured way to change an ns (without building a UI)
app.get("/change-ns", (req, res) => {
  // update namespaces array
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0)); // add a new room
  // let everyone in this namespace that it has changed
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});

io.on("connection", (socket) => {
  socket.on("clientConnect", () => {
    console.log(socket.id + " is connected");
  });
  socket.emit("nsList", namespaces);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    // console.log(`${socket.id} connected to ${namespace.endpoint}`);
    socket.on("joinRoom", async (roomObj, ackCallback) => {
      // need to fetch the history
      const thisNs = namespaces[roomObj.namespaceId];
      const thisRoom = thisNs.rooms.find((room) => room.roomTitle === roomObj.roomTitle);
      const thisRoomHistory = thisRoom.history;

      // leave all rooms (except own room ), because the client can only be in one room
      const rooms = socket.rooms;
      let i = 0;
      rooms.forEach((room) => {
        // we don't want to leave the socket's personal room which is guaranteed to be first
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      // join the room
      // NOTE - roomTitle is coming from the client, which is NOT safe
      // Auth to make sure the socket has right to be in that room
      socket.join(roomObj.roomTitle);

      // fetch the number of sockets in this room
      const socketCount = await io.of(namespace.endpoint).in(roomObj.roomTitle).fetchSockets();
      ackCallback({
        numUsers: socketCount.length,
        thisRoomHistory,
      });
    });

    // listen to newMessageToRoom event from client
    socket.on("newMessageToRoom", (messageObj) => {
      console.log(messageObj);
      // broadcast the message to all the connected clients (THIS ROOM ONLY!)
      // find out what room this socket is
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1]; // this is a set, so we need to convert to an array, spread and access the 2nd element
      // send out this messageObj to everyone including the sender
      io.of(namespace.endpoint).in(currentRoom).emit("messageToRoom", messageObj);
      // add this message to this room's history
      const thisNs = namespaces[messageObj.selectedNsId];
      const thisRoom = thisNs.rooms.find((room) => room.roomTitle === currentRoom);
      thisRoom.addMessage(messageObj);
    });
  });
});
