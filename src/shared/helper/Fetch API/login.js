import checkError from '../checkError'

export const loginHelper = async (apiServer, username, password) => {
	if (username === '' || password === '') {
		checkError('Please enter credentials!')
		return
	}
	const response = await fetch(
		`${apiServer}/Authentication?username=${username}&password=${password}`,
		{ method: 'POST' }
	)
	const data = await response.json()
	console.log(response, data)
	return data
}

export const getProfileHelper = async (apiServer, accessToken) => {
	const response = await fetch(`${apiServer}/Users/Profile`, {
		method: 'GET',
		headers: { Authorization: 'Bearer ' + accessToken },
	})
	const data = await response.json()
	return data
}

export const forgotHelper = async (apiServer, username) => {
	if (username === '') {
		checkError('Please enter an email address!')
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
	return data
}

export default loginHelper
