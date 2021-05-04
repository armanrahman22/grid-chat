const express = require("express")
const socket_io = require("socket.io")
const http = require("http")
const { EventHubConsumerClient } = require("@azure/event-hubs")
const { ContainerClient } = require("@azure/storage-blob")
const { BlobCheckpointStore } = require("@azure/eventhubs-checkpointstore-blob")
const { listenRouter } = require("./routes/listen")

require("dotenv").config()
const port = 3007
const message_event = process.env.NEW_CHAT_MESSAGE_EVENT || "newChatMessage"
const connectionString = "EVENT HUBS NAMESPACE CONNECTION STRING"
const eventHubName = "EVENT HUB NAME"
const consumerGroup = "$Default" // name of the default consumer group
const storageConnectionString = "AZURE STORAGE CONNECTION STRING"
const containerName = "BLOB CONTAINER NAME"

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
