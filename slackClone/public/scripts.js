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
};

const addListeners = (nsId) => {
  // nameSpaceSockets[ns.id] = thisNs;
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("namespace changed!");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  } else {
    // nothing to do listener has been added
  }
};

socket.on("connect", () => {
  // console.log("Connected!");
  socket.emit("clientConnect");
});

socket.on(" ", (data) => {
  console.log(data);
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
