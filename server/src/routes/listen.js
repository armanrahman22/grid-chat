// import express from "express"
// import { ioServer } from "../helpers/socketHelper"

// export const listenRouter = express.Router()

// /* Default listen route */
// listenRouter.get("/", async (req, res, next) => {
// 	const chatId = req.body.chatId
// 	const graphClient = graph.Client.init({
// 		authProvider: (done) => {
// 			done(null, accessToken)
// 		},
// 	})
// })

// listenRouter.post("/", async (req, res, next) => {
// 	const chatId = req.body.chatId
// })

// listenRouter.delete("/:subscriptionId", async (req, res, next) => {
// 	const chatId = req.body.chatId
// })

// listenRouter.patch("/:subscriptionId", async (req, res, next) => {
// 	const chatId = req.body.chatId
// })

// listenRouter.post("/:teamsId/:channelId", async (req, res, next) => {
// 	const chatId = req.body.chatId
// })

// function emitNotification(subscriptionId, data) {
// 	ioServer.to(subscriptionId).emit("notification_received", data)
// }
