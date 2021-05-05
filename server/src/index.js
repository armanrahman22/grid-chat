import express from "express"
import socket_io from "socket.io"
import http from "http"
import dotenv from "dotenv"
import RateLimit from "express-rate-limit"
import cors from "cors"
import morganMiddleware from "./logging/morganMiddleware"
import Logger from "./logging/logger"

import { listenRouter } from "./routes/listen"

dotenv.config()
const port = 3007
const message_event = process.env.NEW_CHAT_MESSAGE_EVENT || "newChatMessage"
const limiter = new RateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 2400, // 20 rps, these values should be adjusted for production use depending on your infrastructure and the volume of notifications you expect
})

const app = express()
const server = http.Server(app)
const io = socket_io(server, {
	cors: {
		origin: "*",
	},
})

// initialize the logger
app.use(morganMiddleware)

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json())

// here we are adding middleware to allow cross-origin requests
app.use(cors())

// app.use("/subscriptions", listenRouter)
app.use(limiter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error("Not Found")
	err.status = 404
	next(err)
})

io.on("connection", (socket) => {
	Logger.info(`Client ${socket.id} connected`)

	// Join a conversation
	const { chatId } = socket.handshake.query
	socket.join(chatId)

	// Listen for new messages
	socket.on(message_event, (data) => {
		Logger.info(`Message recieved from: ${data.senderId}`)
		io.in(chatId).emit(message_event, data)
	})

	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		Logger.info(`Client ${socket.id} diconnected`)
		socket.leave(chatId)
	})
})

server.listen(port, () => {
	Logger.info(`Listening on port ${port}`)
})
