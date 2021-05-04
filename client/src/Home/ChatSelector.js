import React, { useState, useEffect } from "react"
import { Providers, ProviderState } from "@microsoft/mgt"
import { Dropdown, Flex } from "@fluentui/react-northstar"
import { useHistory } from "react-router-dom"

const ChatSelector = () => {
	const history = useHistory()
	const [isSignedIn, setIsSignedIn] = useState(false)
	const [convos, setConvos] = useState([])

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
		const handleClick = (chatId) => (e) => {
			e.preventDefault()
			history.push(`/${chatId}`)
		}
		if (isSignedIn) {
			const getConvos = async () => {
				const provider = Providers.globalProvider
				console.log("getUser provider: ", provider)

				if (provider) {
					const graphClient = provider.graph.client
					const user_id = await graphClient
						.api("me")
						.select("id")
						.version("beta")
						.get()
					if (!user_id) {
						return []
					}
					console.log("user_id: ", user_id.id)
					const chats = await graphClient
						.api("me/chats")
						.expand("members")
						.version("beta")
						.get()
					console.log("user_chats:", chats.value)

					const chatElements = chats.value.map((chat) => {
						if (chat.chatType === "oneOnOne") {
							console.log("chat: ", chat)
							const otherPerson = chat.members.find((member) => {
								return (
									member.userId !==
									provider._userAgentApplication.account.accountIdentifier
								)
							})

							if (!otherPerson) {
								return {}
							}
							return {
								key: chat.id,
								content: (
									<mgt-person
										user-id={otherPerson.userId}
										view="twoLines"
									></mgt-person>
								),
								onClick: handleClick(chat.id),
							}
						}
						return {
							// TODO: handle multiple people
							// key: chat.id,
							// content: (
							// 	<Flex>
							// 		<mgt-people
							// 			show-max="4"
							// 			user-ids="d078b98f-7996-4a6b-a812-9d12c6ed464c,bed2a093-607b-462a-aa1f-1eb47590d5b3"
							// 		></mgt-people>
							// 		<Flex hAlign="center" vAlign="center">
							// 			<Text truncated size="large" content={`Other People`} />
							// 		</Flex>
							// 	</Flex>
							// ),
						}
					})
					const filteredChats = chatElements.filter(
						(value) => Object.keys(value).length !== 0,
					)
					console.log("filteredChats", filteredChats)
					setConvos(filteredChats)
				}
			}
			getConvos()
		}
	}, [isSignedIn, history])

	return (
		<Flex fill hAlign="center" vAlign="center">
			<Dropdown
				autoSize
				items={convos}
				placeholder="Select your conversation"
			/>
		</Flex>
	)
}

export default ChatSelector
