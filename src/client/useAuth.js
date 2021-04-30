import React, { useState, useEffect } from "react"
import { useTeams } from "msteams-react-base-component"
import * as microsoftTeams from "@microsoft/teams-js"

const useAuth = () => {
	const [{ inTeams, theme, context }] = useTeams()
	const [ssoToken, setSsoToken] = useState()
	const [serverToken, setServerToken] = useState([])
	const [error, setError] = useState()

	useEffect(() => {
		//Exchange the SSO access token for a Graph access token
		//Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow
		const getServerSideToken = async (token) => {
			console.log(token)
			let serverURL = `/auth/token?token=${token}`
			let response = await fetch(serverURL).catch((e) => {
				console.error("Unhandled fetch error: ", e)
				setError(e)
			})
			console.log(response)
			let data = await response.json().catch((e) => {
				console.error("Unhandled fetch error: ", e)
				setError(e)
			})

			if (!response.ok && data.error === "consent_required") {
				//A consent_required error means it's the first time a user is logging into to the app, so they must consent to sharing their Graph data with the app.
				//They may also see this error if MFA is required.
				requestConsent() //Proceed to show the consent dialogue.
			} else if (!response.ok) {
				//Unknown error
				console.error(data)
				setError(data.error)
			} else {
				//Server side token exchange worked. Save the access_token to state, so that it can be picked up and used by the componentDidMount lifecycle method.
				setServerToken(data["access_token"])
			}
		}

		// Show the consent pop-up
		const requestConsent = () => {
			microsoftTeams.authentication.authenticate({
				url: window.location.origin + "/auth/auth-start",
				width: 600,
				height: 535,
				successCallback: (result) => {
					setServerToken(result)
				},
				failureCallback: (reason) => {
					setError(reason)
				},
			})
		}

		if (inTeams === true) {
			microsoftTeams.authentication.getAuthToken({
				successCallback: async (token) => {
					setSsoToken(token)
					await getServerSideToken(token)
					microsoftTeams.appInitialization.notifySuccess()
				},
				failureCallback: (message) => {
					setError(message)
					microsoftTeams.appInitialization.notifyFailure({
						reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
						message,
					})
				},
				resources: [
					`api://${process.env.REACT_APP_HOSTNAME}/${process.env.REACT_APP_CLIENT_ID}`,
				],
			})
		}
	}, [inTeams])

	return { serverToken, setServerToken }
}

export default useAuth
