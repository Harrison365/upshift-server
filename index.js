const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  socket.on("join room", (room) => {
    socket.join(room);
    console.log(`User with ID:${socket.id} joined room ${room}`);
  });
  socket.on("chat message", (content) => {
    io.to(content.roomId).emit("chat message", content);
  });
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
});

const { PORT } = process.env;

server.listen(PORT, () => console.log(`Listening on ${PORT}...`));
