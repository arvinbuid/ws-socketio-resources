const joinRoom = async (roomTitle, namespaceId) => {
  console.log(roomTitle, namespaceId);

  const ackResponse = await nameSpaceSockets[namespaceId].emitWithAck("joinRoom", roomTitle);

  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResponse.numUsers} <span class="fa-solid fa-users"></span>`;
  document.querySelector(".curr-room-text").innerText = roomTitle;
};

//   REFERENCE (CALLBACK VERSION):
//   nameSpaceSockets[namespaceId].emit("joinRoom", roomTitle, (ackResponse) => {
//     document.querySelector(
//       ".curr-room-num-users"
//     ).innerHTML = `${ackResponse.numUsers} <span class="fa-solid fa-users"></span>`;
//   });
