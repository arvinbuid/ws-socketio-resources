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
    nsDiv.innerHTML += `<div class="namespace" ns=${ns.name}><img src=${ns.image}></div>`;
  });
  console.log(nsData);
});
