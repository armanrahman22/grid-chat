import express from "express"
import { ioServer } from "../helpers/socketHelper"

export const listenRouter = express.Router()

/* Default listen route */
listenRouter.post("/", async (req, res, next) => {})

function emitNotification(subscriptionId, data) {
	ioServer.to(subscriptionId).emit("notification_received", data)
}
