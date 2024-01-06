const { getUsers, users } = require("./getUsers");
const socketInfo = {};
function socket(io) {
  io.on("connection", (socket) => {
    // socket.on("joined-user", (data) => {
    //   var user = {};
    //   user[socket.id] = data.username;
    //   const roomUsers = users[data.roomname] || [];
    //   const existingUser = roomUsers.find((u) => Object.keys(u)[0] === socket.id);
    //   if (existingUser) {
    //     existingUser[socket.id] = data.username;
    //   } else {
    //     roomUsers.push(user);
    //   }

    //   users[data.roomname] = roomUsers;

    //   socket.join(data.roomname);

    //   io.to(data.roomname).emit("joined-user", { username: data.username });

    //   io.to(data.roomname).emit("online-users", getUsers(users[data.roomname]));

    //   // io.to(data.roomname).emit("disconnect-users", { username: data.username });
      
      

    // });
    socket.on("joined-user", (data) => {
      var user = {};
      user[socket.id] = data.username;
      const roomUsers = users[data.roomname] || [];
      const existingUser = roomUsers.find((u) => Object.keys(u)[0] === socket.id);
      if (existingUser) {
        existingUser[socket.id] = data.username;
      } else {
        roomUsers.push(user);
      }

      users[data.roomname] = roomUsers;

      socket.join(data.roomname);

      // Store socket information
      socketInfo[socket.id] = {
        roomname: data.roomname,
      };

      io.to(data.roomname).emit("joined-user", { username: data.username });
      io.to(data.roomname).emit("online-users", getUsers(users[data.roomname]));
    });

    socket.on("chat", (data) => {
      io.to(data.roomname).emit("chat", {
        username: data.username,
        message: data.message,
      });
    });

    socket.on("typing", (data) => {
      socket.broadcast.to(data.roomname).emit("typing", data.username);
    });

    // socket.on("disconnecting", () => {
    //   var rooms = Object.keys(socket.rooms);
    //   var socketId = rooms[0];
    //   var roomname = rooms[1];
    //   //     console.log('Disconnecting socket ID:', socketId);
    //   // console.log('Room name:', roomname);
    //   // console.log('Users in room before disconnect:', users[roomname]);
    //   console.log(socket.rooms)

    // //   if (users[roomname]) {
    // //   users[roomname].forEach((user, index) => {
    // //     if (user[socketId]) {
    // //       users[roomname].splice(index, 1);
    // //     }
    // //   });
    // // } else {
    // //   console.log(`Room ${roomname} does not exist in users`);
    // // }
    // if (users[roomname]) {
    //   users[roomname] = users[roomname].filter(user => user.socketId !== socketId);
      
    // } else {
    //   console.log(`Room ${roomname} does not exist in users`);
    // }
    //   io.to(roomname).emit("online-users", getUsers(users[roomname]));
    // });
    socket.on("disconnecting", () => {
      var socketId = socket.id;
      var roomname = socketInfo[socketId] ? socketInfo[socketId].roomname : undefined;

      console.log("Socket ID:", socketId);
      console.log("Roomname:", roomname);

      if (roomname && users[roomname]) {
        users[roomname] = users[roomname].filter(user => Object.keys(user)[0] !== socketId);
        io.to(roomname).emit("online-users", getUsers(users[roomname]));
      } else {
        console.log(`Room ${roomname} does not exist in users`);
      }

      // Remove socket information on disconnect
      delete socketInfo[socketId];
    });
  });
}
module.exports = socket;