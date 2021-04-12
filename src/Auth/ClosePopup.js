// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React, { useEffect } from "react"
import * as microsoftTeams from "@microsoft/teams-js"

/**
 * This component is loaded when the Azure implicit grant flow has completed.
 */
const ClosePopup = () => {
	useEffect(() => {
		microsoftTeams.initialize()

		//The Azure implicit grant flow injects the result into the window.location.hash object. Parse it to find the results.
		let hashParams = getHashParameters()

		//If consent has been successfully granted, the Graph access token should be present as a field in the dictionary.
		if (hashParams["access_token"]) {
			//Notifify the showConsentDialogue function in Tab.js that authorization succeeded. The success callback should fire.
			microsoftTeams.authentication.notifySuccess(hashParams["access_token"])
		} else {
			microsoftTeams.authentication.notifyFailure("Consent failed")
		}
		// Parse hash parameters into key-value pairs
		function getHashParameters() {
			let hashParams = {}
			window.location.hash
				.substr(1)
				.split("&")
				.forEach(function (item) {
					let s = item.split("="),
						k = s[0],
						v = s[1] && decodeURIComponent(s[1])
					hashParams[k] = v
				})
			return hashParams
		}
	}, [])

	return (
		<div>
			<h1>Consent flow complete.</h1>
		</div>
	)
}

export default ClosePopup
