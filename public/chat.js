const output = document.getElementById("output");
const message = document.getElementById("message");
const send = document.getElementById("send");
const feedback = document.getElementById("feedback");
const roomMessage = document.querySelector(".room-message");
const users = document.querySelector(".users");
const usersjoin = document.querySelector(".users-join");


const url = new URL(window.location.href)
const socket = io.connect(url.host);
// console.log(url);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get("username");
const roomname = urlParams.get("roomname");
// console.log(username, roomname);

roomMessage.innerHTML = `Connected in room ${roomname}`;

socket.emit("joined-user", {
  username: username,
  roomname: roomname,
});

send.addEventListener("click", () => {
  socket.emit("chat", {
    username: username,
    message: message.value,
    roomname: roomname,
  });
  message.value = "";
});


message.addEventListener("keypress", () => {
  socket.emit("typing", { username: username, roomname: roomname });
});

function showJoinPopup(username) {
  usersjoin.innerHTML = username + " joined the room";

  // Set a timeout to close the alert after 3 seconds
  setTimeout(function () {
    // Check if the alert is still open before trying to close it
    usersjoin.innerHTML = "";
  }, 3000);
}
socket.on("joined-user", (data) => {
  // output.innerHTML +=
  //   "<p>--> <strong><em>" +
  //   data.username +
  //   " </strong>has Joined the Room</em></p>";
  showJoinPopup(data.username);
});


let params = new URLSearchParams(window.location.search);
let usernamee = params.get('username');

let messages = JSON.parse(localStorage.getItem('messages')) || [];

messages.forEach((data) => {
  let alignClass = data.username === usernamee ? 'right-align' : 'left-align';
  output.innerHTML +=
    `<p class="${alignClass}"><strong>${data.username}</strong>:<br> ${data.message}</p>`;
});

socket.on("chat", (data) => {
  data.message = data.message.replace(/\n/g, '<br>'); // Add this line
  messages.push(data);
  localStorage.setItem('messages', JSON.stringify(messages));
  let params = new URLSearchParams(window.location.search);
  let username = params.get('username');
  let alignClass = data.username === username ? 'right-align' : 'left-align';
  output.innerHTML +=
    `<p class="${alignClass}"><strong>${data.username}</strong>:<br> ${data.message}</p>`;
  // output.innerHTML +=
  //   "<p><strong>" + data.username + "</strong>:<br> " + data.message + "</p>";
  feedback.innerHTML = "";
  document.querySelector(".chat-message").scrollTop =
    document.querySelector(".chat-message").scrollHeight;
});


socket.on("typing", (user) => {
  feedback.innerHTML = "<p><em>" + user + " is typing...</em></p>";
});

// socket.on("disconnect-users", (data) => {
//   console.log(data);
//   users.innerHTML = "";
//   data.forEach((user) => {
//     users.innerHTML += `<p>${user}</p>`;
//   });
// });
window.addEventListener('beforeunload', function ()  {
  socket.emit('online-users');
});
socket.on("online-users", (user) => {
  users.innerHTML = "";
  user.forEach((user) => {
    users.innerHTML += `<p>${user}</p>`;
  });
});

// socket.on("disconnect-users", (disconnectedUsers) => {
//   let userElement = document.querySelector(`p:contains('${disconnectedUsers.username}')`);
//   if (userElement) userElement.remove();
// });
socket.on("disconnect-users", (disconnectedUser) => {
  console.log(disconnectedUser);
  // Get all user elements
  let userElements = Array.from(document.querySelectorAll('p'));
  // Find the element that contains the disconnected user's name
  let userElement = userElements.find(element => element.textContent === disconnectedUser.username);
  // If the element exists, remove it
  if (userElement) userElement.remove();
});
// socket.on('disconnect', () => {
//   delete users[socket.id];
//   io.emit('joined-user', Object.values(users));
// });
// window.addEventListener('beforeunload', function ()  {
//   console.log(event);
//   delete users[socket.id];
//   console.log(users);
//   io.emit('joined-user', {username, roomname});
  
// });

// async function getChatGptResponse(message) {
//   try {
//     const response = await axios.post(
//       "/chat-gpt", // The server route to handle ChatGPT requests (see below)
//       {
//         message: message,
//       }
//     );

//     return response.data.generatedMessage;
//   } catch (error) {
//     console.error("Error generating chat response:", error);
//     return null;
//   }
// }
