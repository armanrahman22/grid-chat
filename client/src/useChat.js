import { Providers, ProviderState } from "@microsoft/mgt"
import { EventHubConsumerClient } from "@azure/event-hubs"
import { ContainerClient } from "@azure/storage-blob"
import { BlobCheckpointStore } from "@azure/eventhubs-checkpointstore-blob"
import { useEffect, useRef, useState } from "react"
import socketIOClient from "socket.io-client"

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"

const useChat = (chatId) => {
	const socketRef = useRef()
	const [messages, setMessages] = useState([])
	const [isSignedIn, setIsSignedIn] = useState(false)
	const [loadedMessages, setLoadedMessages] = useState(false)

	useEffect(() => {
		const updateState = () => {
			const provider = Providers.globalProvider
			setIsSignedIn(provider && provider.state === ProviderState.SignedIn)
		}

		Providers.onProviderUpdated(updateState)
		updateState()

		return () => {
			Providers.removeProviderUpdatedListener(updateState)
		}
	}, [])

	useEffect(() => {
		console.log("isSignedIn", isSignedIn)
		if (isSignedIn && !loadedMessages) {
			const getMessages = async () => {
				const provider = Providers.globalProvider
				console.log("getMessages provider: ", provider)

				if (provider) {
					const graphClient = provider.graph.client
					const user = await graphClient
						.api("me")
						.select("id")
						.version("beta")
						.get()
					if (!user) {
						return []
					}
					console.log("user_id: ", user.id)
					const chat = await graphClient
						.api(`me/chats/${chatId}/messages`)
						.version("beta")
						.get()
					console.log("user_chat:", chat.value)

					const chatMessages = chat.value.map((chatMessage) => {
						return {
							user: chatMessage.from.user,
							body: chatMessage.body.content,
							ownedByCurrentUser: chatMessage.from.user.id === user.id,
							createdDateTime: chatMessage.createdDateTime,
						}
					})
					console.log("chatMessages", chatMessages)
					setMessages((messages) => [...messages, ...chatMessages])
					setLoadedMessages(true)

					// // Set Subscription
					// const subscription = {
					// 	changeType: "created",
					// 	notificationUrl:
					// 		"EventHub:https://arrahm-blk-poc-kv.vault.azure.net/secrets/event-hub-connection-string?tenantId=microsoft.onmicrosoft.com",
					// 	resource: `chats/${chatId}/messages`,
					// 	expirationDateTime: new Date(Date.now() + 3600000).toISOString(),
					// }

					// await graphClient
					// 	.api("/subscriptions")
					// 	.version("beta")
					// 	.post(subscription)
				}
			}
			getMessages()
		}
	}, [isSignedIn, chatId, loadedMessages])

	useEffect(() => {
		socketRef.current = socketIOClient(window.location.origin, {
			query: { chatId },
		})

		socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
			console.log("message: ", message)
			const incomingMessage = {
				...message,
				ownedByCurrentUser: message.senderId === socketRef.current.id,
			}
			setMessages((messages) => [...messages, incomingMessage])
		})

		return () => {
			socketRef.current.disconnect()
		}
	}, [chatId])

	const sendMessage = async (messageBody) => {
		socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
			body: messageBody,
			senderId: socketRef.current.id,
		})
		if (isSignedIn && Providers.globalProvider) {
			const graphClient = Providers.globalProvider.graph.client
			const response = await graphClient
				.api(`/chats/${chatId}/messages`)
				.version("beta")
				.post({
					body: {
						content: messageBody,
					},
				})
			console.log("sendMessage", response)
		}
	}

	return { messages, sendMessage }
}

export default useChat
