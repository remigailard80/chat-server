const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer, {
  path: '/socket.io',
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ['websocket']
  }})

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.send({ response: "I am alive" }).status(200);
})

io.on("connection", (socket) => {
  // connection successed
  socket.emit('connection', "hello");
  socket.on("join", (userId) => {
    socket.join(userId);
  });
  socket.on("message", (msg) => {
    console.log(msg);
    socket.broadcast.emit("message", msg);
    socket.emit("message", msg);
  });
  socket.on("disconnect", () => {
      console.log("user disconnected");
  });
});

httpServer.listen(8000, () => console.log("Listen on http://localhost:8000"));
