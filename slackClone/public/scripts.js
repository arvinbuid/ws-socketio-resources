// client
// const userName = prompt("What is your username?: ");
// const userPassword = prompt("What is your password?: ");

// Temp remove prompt for development
const userName = "John";
const userPassword = "x";
const socket = io("http://localhost:9000");

// sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

// a global variable we can update when the user clicks on a namespace
// we will use it to broadcast across the app
let selectedNsId = 0;

// add a submit handler to the form
document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.querySelector("#user-message");

  const newMessage = messageInput.value;

  console.log(selectedNsId, newMessage);
  // emit a newMessageToRoom event to server
  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    msgDate: Date.now(),
    avatar: "https://placehold.co/30x30",
    userName,
    selectedNsId,
  });

  messageInput.value = ""; // clear the input
});

// addListeners job is to manage all listeners added to all namespaces
// this prevent listeners being added multiple times and makes life
// better for us developers
const addListeners = (nsId) => {
  // nameSpaceSockets[ns.id] = thisNs;
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("namespace changed!");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    // add the nsId listener to this namespace
    nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
      document.querySelector("#messages").innerHTML += buildMessageHtml(messageObj);
      console.log(messageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

socket.on("connect", () => {
  socket.emit("clientConnect");
});
// listen for nsList event from the server
socket.on("nsList", (nsData) => {
  const nsDiv = document.querySelector(".namespaces");
  nsDiv.innerHTML = "";
  nsData.forEach((ns) => {
    nsDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.image}></div>`;

    // initialize thisNameSpace as its index in nameSpaceSockets
    // if the connection is new, this will be null
    // if the connection has already been established, it will reconnect and remain in its spot
    // let thisNs = nameSpaceSockets[ns.id];

    if (!nameSpaceSockets[ns.id]) {
      // there is no socket at this namespace id, so make new connection
      // join this namespace with io()
      nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`); // /wiki, /mozilla, /linux
    }
    addListeners(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach((element) => {
    element.addEventListener("click", () => {
      joinNs(element, nsData);
    });
  });

  const lastNs = localStorage.getItem("lastNs") || "/wiki";
  // if lastNs is set, grab the element and set it
  const lastNsElement = document.querySelector(`.namespace[ns="${lastNs}"]`);
  if (lastNsElement) joinNs(lastNsElement, nsData);
});
