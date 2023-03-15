import checkError from '../checkError'

const loginHelper = async (apiServer, username, password) => {
	if (username === '' || password === '') {
		checkError('Please enter credentials!')
		return
	}
	const response = await fetch(
		`${apiServer}/Authentication?username=${username}&password=${password}`,
		{ method: 'POST' }
	)
	const data = await response.json()
	return data
}

export default loginHelper
