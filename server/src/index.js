import express from "express"
import socket_io from "socket.io"
import http from "http"
import dotenv from "dotenv"

dotenv.config()
const port = 3007
const message_event = process.env.NEW_CHAT_MESSAGE_EVENT || "newChatMessage"

const app = express()
const server = http.Server(app)
const io = socket_io(server, {
	cors: {
		origin: "*",
	},
})

io.on("connection", (socket) => {
	console.log(`Client ${socket.id} connected`)

	// Join a conversation
	const { chatId } = socket.handshake.query
	socket.join(chatId)

	// Listen for new messages
	socket.on(message_event, (data) => {
		io.in(chatId).emit(message_event, data)
	})

	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		console.log(`Client ${socket.id} diconnected`)
		socket.leave(chatId)
	})
})

server.listen(port, () => {
	console.log(`Listening on port ${port}`)
})
