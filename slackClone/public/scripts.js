// client
// const userName = prompt("What is your username?: ");
// const userPassword = prompt("What is your password?: ");

// Temp remove prompt for development
const userName = "John";
const userPassword = "x";

const socket = io("http://localhost:9000");

socket.on("connect", () => {
  console.log("Connected!");
  socket.emit("clientConnect");
});

socket.on("welcome", (data) => {
  console.log(data);
});

// listen for nsList event from the server
socket.on("nsList", (nsData) => {
  const nsDiv = document.querySelector(".namespaces");
  nsData.forEach((ns) => {
    nsDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.image}></div>`;
  });

  Array.from(document.getElementsByClassName("namespace")).forEach((ns) => {
    ns.addEventListener("click", () => {
      const nsEndpoint = ns.getAttribute("ns"); // get the ns attribute
      const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
      const rooms = clickedNs.rooms;

      const roomsList = document.querySelector(".room-list");
      roomsList.innerHTML = "";
      // loop through each room and add it to the dom
      rooms.forEach((room) => {
        roomsList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`;
      });
    });
  });
});
