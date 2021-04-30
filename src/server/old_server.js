import * as fs from "fs"
import * as path from "path"
import express from "express"
import socket_io from "socket.io"
import msal from "@azure/msal-node"
import fetch from "node-fetch"
import http from "http"

const ONE_HOUR = 60 * 60
const SERVER_PORT = normalizePort(process.env.PORT || "3001")

const app = express()

let bundleName = ""

if (!bundleName) {
	fs.readdirSync(path.resolve(__dirname, "../client")).forEach((file) => {
		if (!bundleName && file.includes(".js")) {
			bundleName = file
		}
	})
}

app.use(
	express.static("./public", {
		maxAge: ONE_HOUR,
	}),
)
app.use(
	express.static("./dist", {
		maxAge: ONE_HOUR,
	}),
)

app.use(rootPath, rootRoute(bundleName))

const server = app.listen(SERVER_PORT, () => {
	serverInfo([
		"Server started:",
		` - URL: ${SERVER_URL}:${SERVER_PORT}`,
		` - Env: ${config.get("env")}`,
		` - Bundle: ${bundleName}`,
	])
})

export default server

// const server = http.Server(app)
// const io = socket_io(server, {
// 	cors: {
// 		origin: "*",
// 	},
// })

// require("dotenv").config()
// const port = 3007
// const message_event = process.env.NEW_CHAT_MESSAGE_EVENT || "newChatMessage"

// io.on("connection", (socket) => {
// 	console.log(`Client ${socket.id} connected`)

// 	// Join a conversation
// 	const { chatId } = socket.handshake.query
// 	socket.join(chatId)

// 	// Listen for new messages
// 	socket.on(message_event, (data) => {
// 		io.in(chatId).emit(message_event, data)
// 	})

// 	// Leave the room if the user closes the socket
// 	socket.on("disconnect", () => {
// 		console.log(`Client ${socket.id} diconnected`)
// 		socket.leave(chatId)
// 	})
// })

// server.listen(port, () => {
// 	console.log(`Listening on port ${port}`)
// })
