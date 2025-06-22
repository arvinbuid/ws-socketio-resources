// We could ask the server for fresh info on this namespace which is BAD!
// We have socket.io/ws, and the server will tell us when something has happened

const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute("ns"); // get the ns attribute
  const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
  const rooms = clickedNs.rooms;

  const roomsList = document.querySelector(".room-list");
  roomsList.innerHTML = ""; // clear existing rooms

  let roomsHtml = "";
  // loop through each room and add it to the dom
  rooms.forEach((room) => {
    roomsHtml += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`;
  });

  roomsList.innerHTML = roomsHtml;
  localStorage.setItem("lastNs", nsEndpoint);
};
