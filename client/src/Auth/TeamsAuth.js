// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React, { useEffect } from "react"
import { TeamsProvider } from "@microsoft/mgt"
import * as microsoftTeams from "@microsoft/teams-js"
/**
 * This component is used to redirect the user to the Azure authorization endpoint from a popup
 */
const TeamsAuth = () => {
	useEffect(() => {
		console.log("TeamsAuth")
		TeamsProvider.microsoftTeamsLib = microsoftTeams
		TeamsProvider.handleAuth()
	}, [])
	return <div></div>
}

export default TeamsAuth
