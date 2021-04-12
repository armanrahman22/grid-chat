import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import * as microsoftTeams from "@microsoft/teams-js"
import { Provider, themeNames } from "@fluentui/react-teams"

import "./index.css"
import Home from "./Home/Home"
import ChatRoom from "./ChatRoom/ChatRoom"
import TeamsAuth from "./Auth/TeamsAuth"
import { CacheService } from "@microsoft/mgt"
CacheService.config.isEnabled = false

function initTeamsTheme(theme) {
	switch (theme) {
		case "dark":
			return themeNames.Dark
		case "contrast":
			return themeNames.HighContrast
		default:
			return themeNames.Default
	}
}

function App() {
	const [appContext, setAppContext] = useState()
	const [appAppearance, setAppAppearance] = useState(themeNames.Default)

	// Initialize the Microsoft Teams SDK

	useEffect(() => {
		microsoftTeams.initialize()

		/**
		 * With the context properties in hand, your app has a solid understanding of what's happening around it in Teams.
		 * https://docs.microsoft.com/en-us/javascript/api/@microsoft/teams-js/context?view=msteams-client-js-latest&preserve-view=true
		 **/
		microsoftTeams.getContext((context) => {
			setAppContext(context)
			setAppAppearance(initTeamsTheme(context.theme))

			/**
			 * Tells Microsoft Teams platform that we are done saving our settings. Microsoft Teams waits
			 * for the app to call this API before it dismisses the dialog. If the wait times out, you will
			 * see an error indicating that the configuration settings could not be saved.
			 **/
			microsoftTeams.appInitialization.notifySuccess()
		})

		/**
		 * Theme change handler
		 * https://docs.microsoft.com/en-us/javascript/api/@microsoft/teams-js/microsoftteams?view=msteams-client-js-latest#registerOnThemeChangeHandler__theme__string_____void_
		 **/
		microsoftTeams.registerOnThemeChangeHandler((theme) => {
			setAppAppearance(initTeamsTheme(theme))
		})
	}, [])

	return (
		<Provider themeName={appAppearance} lang="en-US">
			<Router>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/:chatId" component={ChatRoom} />
					<Route exact path="/auth/teams" component={TeamsAuth} />
				</Switch>
			</Router>
		</Provider>
	)
}

export default App
