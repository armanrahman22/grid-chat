const fetch = require("node-fetch")
const express = require("express")
const jwt_decode = require("jwt-decode")
const socket_io = require("socket.io")
const http = require("http")

const app = express()

const server = http.Server(app)
const io = socket_io(server, {
	cors: {
		origin: "*",
	},
})

require("dotenv").config()
const port = 3007
const message_event = process.env.NEW_CHAT_MESSAGE_EVENT || "newChatMessage"
const graph_api = "https://graph.microsoft.com/beta/"
// const clientId = process.env.REACT_APP_CLIENT_ID
// const clientSecret = process.env.CLIENT_SECRET
// const graphScopes = "https://graph.microsoft.com/" + process.env.GRAPH_SCOPES

// let handleQueryError = function (err) {
// 	console.log("handleQueryError called: ", err)
// 	return new Response(
// 		JSON.stringify({
// 			code: 400,
// 			message: "Stupid network Error",
// 		}),
// 	)
// }

// app.get("/auth/token", async (req, res) => {
// 	console.log("clientId:", clientId)
// 	console.log("clientSecret:", clientSecret)
// 	let tenantId = jwt_decode(req.query.token)["tid"] //Get the tenant ID from the decoded token
// 	let accessTokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

// 	//Create your access token query parameters
// 	//Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#first-case-access-token-request-with-a-shared-secret
// 	let accessTokenQueryParams = {
// 		grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
// 		client_id: clientId,
// 		client_secret: clientSecret,
// 		assertion: req.query.token,
// 		scope: graphScopes,
// 		requested_token_use: "on_behalf_of",
// 	}

// 	accessTokenQueryParams = new URLSearchParams(
// 		accessTokenQueryParams,
// 	).toString()

// 	let response = await fetch(accessTokenEndpoint, accessTokenReqOptions).catch(
// 		handleQueryError,
// 	)

// 	let data = await response.json()
// 	console.log("Response data: ", data)
// 	if (!response.ok) {
// 		if (
// 			data.error === "invalid_grant" ||
// 			data.error === "interaction_required"
// 		) {
// 			//This is expected if it's the user's first time running the app ( user must consent ) or the admin requires MFA
// 			console.log(
// 				"User must consent or perform MFA. You may also encouter this error if your client ID or secret is incorrect.",
// 			)
// 			res.status(403).json({ error: "consent_required" }) //This error triggers the consent flow in the client.
// 		} else {
// 			//Unknown error
// 			console.log("Could not exchange access token for unknown reasons.")
// 			res.status(500).json({ error: "Could not exchange access token" })
// 		}
// 	} else {
// 		//The on behalf of token exchange worked. Return the token (data object) to the client.
// 		res.send(data)
// 	}
// })

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
