import React from "react"

import "./Home.css"
import NavBar from "../NavBar/NavBar"
import ChatSelector from "./ChatSelector"
import { Flex, Segment } from "@fluentui/react-northstar"

const Home = () => {
	return (
		<Flex column>
			<NavBar />

			<Segment>
				<ChatSelector />
			</Segment>
		</Flex>
	)
}

export default Home
