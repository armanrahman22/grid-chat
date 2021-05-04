"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ioServer = void 0;

const express = require("express");

const socket_io = require("socket.io");

const http = require("http");

const app = express();
const socketServer = http.Server(app);
const ioServer = socket_io(socketServer, {
  cors: {
    origin: "*"
  }
});
exports.ioServer = ioServer;
socketServer.listen(3001); // Socket Event

ioServer.on("connection", socket => {
  console.log(`Client ${socket.id} connected`); // Join a conversation

  const {
    chatId
  } = socket.handshake.query;
  socket.join(chatId); // Listen for new messages

  socket.on(message_event, data => {
    io.in(chatId).emit(message_event, data);
  }); // Leave the room if the user closes the socket

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(chatId);
  });
});