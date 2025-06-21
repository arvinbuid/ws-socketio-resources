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
  const lastNs = localStorage.getItem("lastNs") || "/wiki";
  const nsDiv = document.querySelector(".namespaces");
  nsDiv.innerHTML = "";
  nsData.forEach((ns) => {
    nsDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.image}></div>`;
  });

  Array.from(document.getElementsByClassName("namespace")).forEach((element) => {
    element.addEventListener("click", () => {
      joinNs(element, nsData);
    });
  });

  // if lastNs is set, grab the element and set it
  const lastNsElement = document.querySelector(`.namespace[ns="${lastNs}"]`);
  if (lastNsElement) joinNs(lastNsElement, nsData);
});
