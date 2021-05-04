import express from "express"
import socket_io from "socket.io"
import http from "http"
import dotenv from "dotenv"

dotenv.config()
const message_event = process.env.NEW_CHAT_MESSAGE_EVENT || "newChatMessage"

const app = express()
const socketServer = http.Server(app)
export const ioServer = socket_io(socketServer, {
	cors: {
		origin: "*",
	},
})

socketServer.listen(3001)

// Socket Event
ioServer.on("connection", (socket) => {
	console.log(`Client ${socket.id} connected`)

	// Join a conversation
	const { chatId } = socket.handshake.query
	socket.join(chatId)

	// Listen for new messages
	socket.on(message_event, (data) => {
		ioServer.in(chatId).emit(message_event, data)
	})

	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		console.log(`Client ${socket.id} diconnected`)
		socket.leave(chatId)
	})
})
