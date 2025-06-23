const buildMessageHtml = (messageObj) => {
  const {newMessage, msgDate, avatar, userName} = messageObj;
  const date = new Date(msgDate).toLocaleString();
  return `
    <li>
       <div class="user-image">
           <img src=${avatar} />
       </div>
       <div class="user-message">
           <div class="user-name-time">${userName} <span>${date}</span></div>
           <div class="message-text">${newMessage}</div>
       </div>
   </li>
  `;
};
