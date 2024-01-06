const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
var port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("index");
});

const server = app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
const io = socket(server);
require("./utils/socket")(io);

app.post("/room", (req, res) => {
  roomname = req.body.roomname;
  username = req.body.username;
  const uniqueIdentifier = Math.floor(Math.random() * 10000);
  res.redirect(`/room?username=${username+uniqueIdentifier}&roomname=${roomname}`);
});

app.get("/room", (req, res) => {
  res.render("room");
});


