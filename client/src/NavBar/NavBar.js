import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Flex, Menu, Segment, useCSS } from "@fluentui/react-northstar"
import { useTeams } from "msteams-react-base-component"
import * as microsoftTeams from "@microsoft/teams-js"

import { Providers, TeamsProvider, ProviderState } from "@microsoft/mgt"
import { MsalProvider } from "@microsoft/mgt-msal-provider"
const items = [
	{
		key: "home",
		content: <Link to="/">Home</Link>,
	},
]
const NavBar = () => {
	const [{ inTeams }] = useTeams()
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	useEffect(() => {
		console.log("Providers.globalProvider", Providers.globalProvider)
		if (!Providers.globalProvider) {
			let provider
			if (inTeams !== undefined) {
				const graph_scopes = process.env.REACT_APP_GRAPH_SCOPES.split(" ")
				if (inTeams) {
					console.log("Teams Provider graph_scopes: ", graph_scopes)
					TeamsProvider.microsoftTeamsLib = microsoftTeams
					provider = new TeamsProvider({
						clientId: process.env.REACT_APP_CLIENT_ID,
						authPopupUrl: window.location.origin + "/auth/teams",
						scopes: graph_scopes,
					})
				} else {
					console.log("MSAL Provider")
					provider = new MsalProvider({
						clientId: process.env.REACT_APP_CLIENT_ID,
						redirectUri: window.location.origin,
						scopes: graph_scopes,
					})
				}
				Providers.globalProvider = provider
				Providers.globalProvider.onStateChanged((e) => {
					console.log("Providers onStateChanged")
					if (Providers.globalProvider.state !== ProviderState.Loading)
						setIsLoggedIn(
							Providers.globalProvider.state === ProviderState.SignedIn,
						)
				})
			}
		}
	}, [inTeams, isLoggedIn])

	return (
		<Segment color="brand" inverted>
			<Flex space="between">
				<Menu defaultActiveIndex={0} items={items} />

				<Flex>
					<mgt-login></mgt-login>
				</Flex>
			</Flex>
		</Segment>
	)
}

export default NavBar
