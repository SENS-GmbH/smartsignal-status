import checkToast from '../toastHandler/checkToast'
import { defaultFetch } from './request'

/**
 * Makes a request to the authentication API to log in a user with the given username and password.
 * @param {Function} t - Translation function
 * @param {string} apiServer - The URL of the authentication API server.
 * @param {string} username - The username of the user to log in.
 * @param {string} password - The password of the user to log in.
 * @returns {Promise<Object>} - A Promise that resolves to an object with the user's information.
 * @throws {Error} - If there is an error making the API request or if the username or password is empty.
 */
export const loginHelper = async (t, apiServer, username, password) => {
	if (username === '' || password === '') {
		checkToast(t, 11003)
		return
	}
	const response = await defaultFetch(
		`${apiServer}/Authentication?username=${username}&password=${password}`,
		{ method: 'POST' },
		() => checkToast(t, 11005)
	)
	return response
}

/**
 * Makes a request to the user profile API to get the profile information of the user with the given access token.
 * @param {Function} t - Translation function
 * @param {string} apiServer - The URL of the user profile API server.
 * @param {string} accessToken - The access token of the user whose profile to retrieve.
 * @returns {Promise<Object>} - A Promise that resolves to an object with the user's profile information.
 * @throws {Error} - If there is an error making the API request.
 */
export const getProfileHelper = async (t, apiServer, accessToken) => {
	const response = await fetch(`${apiServer}/Users/Profile`, {
		method: 'GET',
		headers: { Authorization: 'Bearer ' + accessToken },
	})
	const data = await response.json()
	return data
}

/**
 * Makes a request to the authentication API to reset the password of the user with the given email address.
 * @param {Function} t - Translation function
 * @param {string} apiServer - The URL of the authentication API server.
 * @param {string} username - The email address of the user whose password to reset.
 * @returns {Promise<Object>} - A Promise that resolves to an object with information about the password reset request.
 * @throws {Error} - If there is an error making the API request or if the username is empty.
 */
export const forgotHelper = async (t, apiServer, username) => {
	if (!username) {
		checkToast(t, 11004)
		return
	}
	const response = await fetch(
		`${apiServer}/Authentication/resetPassword?userEmail=${username}`,
		{ method: 'POST' }
	)
	if (response.ok) {
		return { ok: true }
	}
	const data = await response.json()
	if (data.error === 'not_found') {
		checkToast(t, 11007)
	} else {
		checkToast(t, 11008)
	}
	return { ok: false }
}

export default loginHelper
