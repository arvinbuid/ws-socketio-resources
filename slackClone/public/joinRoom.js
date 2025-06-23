const joinRoom = async (roomTitle, namespaceId) => {
  console.log(roomTitle, namespaceId);

  const ackResponse = await nameSpaceSockets[namespaceId].emitWithAck("joinRoom", {
    roomTitle,
    namespaceId,
  });

  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResponse.numUsers} <span class="fa-solid fa-users"></span>`;
  document.querySelector(".curr-room-text").innerText = roomTitle;

  // we get back the room history in the acknowledgement as well
  document.querySelector("#messages").innerHTML = "";

  ackResponse.thisRoomHistory.forEach((message) => {
    // update the dom to show room message history
    document.querySelector("#messages").innerHTML += buildMessageHtml(message);
  });
};

//   REFERENCE (CALLBACK VERSION):
//   nameSpaceSockets[namespaceId].emit("joinRoom", roomTitle, (ackResponse) => {
//     document.querySelector(
//       ".curr-room-num-users"
//     ).innerHTML = `${ackResponse.numUsers} <span class="fa-solid fa-users"></span>`;
//   });
