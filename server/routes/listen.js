const express = require("express")
const { ioServer } = require("../helpers/socketHelper")
const {
	EventHubConsumerClient,
	earliestEventPosition,
} = require("@azure/event-hubs")

export const listenRouter = express.Router()

/* Default listen route */
listenRouter.post("/", async (req, res, next) => {})

function emitNotification(subscriptionId, data) {
	ioServer.to(subscriptionId).emit("notification_received", data)
}
