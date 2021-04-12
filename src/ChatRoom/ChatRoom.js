import React, { useState } from "react"
import {
	Flex,
	Input,
	Chat,
	Button,
	Header,
	Box,
	Segment,
} from "@fluentui/react-northstar"
import { useTeams } from "msteams-react-base-component"
import { SendIcon } from "@fluentui/react-icons-northstar"

import "./ChatRoom.css"
import useChat from "../useChat"
import ChatToolbar from "./ChatToolbar"
import NavBar from "../NavBar/NavBar"
const ChatRoom = (props) => {
	const { chatId } = props.match.params
	const [{ inTeams, theme, context }] = useTeams()
	const { messages, sendMessage } = useChat(chatId)
	const [newMessage, setNewMessage] = useState("")

	const handleSendMessage = () => {
		sendMessage(newMessage)
		setNewMessage("")
	}

	const handleKeypress = (e) => {
		if (e.key === "Enter") {
			handleSendMessage()
		}
	}

	return (
		<Segment className="chat-room-container">
			<NavBar />
			<Header content={`Room: ${chatId}`} />
			<Box
				className="messages-container"
				styles={{ backgroundColor: "rgb(240, 240, 240)" }}
			>
				<Chat
					items={messages.map((message, i) => ({
						contentPosition: message.ownedByCurrentUser ? "end" : "start",
						message: message.ownedByCurrentUser ? (
							<Chat.Message content={message.body} mine />
						) : (
							<Chat.Message
								content={message.body}
								author={message.user.displayName}
							/>
						),
						key: { i },
					}))}
				/>
			</Box>
			<Flex gap="gap.medium">
				<Flex.Item grow>
					<div onKeyPress={handleKeypress}>
						<Input
							fluid
							placeholder="Type a new message"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
						/>
					</div>
				</Flex.Item>

				<Button
					icon={<SendIcon />}
					iconOnly
					title="Send"
					onClick={handleSendMessage}
				/>
			</Flex>
			<ChatToolbar></ChatToolbar>
		</Segment>
	)
}

export default ChatRoom
