const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const socket = require("socket.io");
const crypto = require('crypto');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
var port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("index");
});
const secretKey = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
}));
const server = app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
const io = socket(server);
require("./utils/socket")(io);

// app.post("/room", (req, res) => {
//   roomname = req.body.roomname;
//   username = req.body.username;
//   const uniqueIdentifier = Math.floor(Math.random() * 10000);
//   res.redirect(`/room?username=${username+uniqueIdentifier}&roomname=${roomname}`);
// });
app.post('/room', (req, res) => {
  const { username, roomname } = req.body;

  // Store the username and roomname in the session
  req.session.username = username+Math.floor(Math.random() * 10000);
  req.session.roomname = roomname;

  // Redirect to the room without exposing parameters in the URL
  res.redirect('/room');
});
app.get("/get-username-roomname", (req, res) => {
  const { username, roomname } = req.session; // Assuming you stored them in the session
  res.json({ username, roomname });
});
app.get('/room', (req, res) => {
  // Access the stored username and roomname from the session
  const { username, roomname } = req.session;
  console.log(username);
  // Render your room template with the username and roomname
  res.render('room', { username, roomname });
});
// app.get("/room", (req, res) => {
  //   res.render("room");
// });


