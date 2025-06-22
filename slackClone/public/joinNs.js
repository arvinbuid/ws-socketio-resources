// We could ask the server for fresh info on this namespace which is BAD!
// We have socket.io/ws, and the server will tell us when something has happen

const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute("ns"); // get the ns attribute
  const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
  const rooms = clickedNs.rooms;

  const roomsList = document.querySelector(".room-list");
  roomsList.innerHTML = ""; // clear existing rooms

  let roomsHtml = "";
  // loop through each room and add it to the dom

  let firstRoom;
  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    roomsHtml += `
      <li class="room" namespaceId=${room.namespaceId}>
        <span class="fa-solid fa-${room.privateRoom ? "lock" : "globe"}"></span>${room.roomTitle}
      </li>
    `;
  });
  roomsList.innerHTML = roomsHtml;

  // init join first room after page load for the first time
  joinRoom(firstRoom, clickedNs.id);

  // add click listener to each room so the client can tell the server it wants to join.
  const roomNodes = document.querySelectorAll(".room");
  Array.from(roomNodes).forEach((el) => {
    el.addEventListener("click", (e) => {
      // console.log("clicked on " + e.target.innerText);
      const namespaceId = el.getAttribute("namespaceId");
      joinRoom(e.target.innerText, namespaceId);
    });
  });

  localStorage.setItem("lastNs", nsEndpoint);
};
