// LS = localStorage
export const getLS = (key) => {
	return localStorage.getItem(key)
}
export const saveLS = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value))
}
export const removeLS = (key) => {
	localStorage.removeItem(key)
}

// LocalStorage Model (Getting from IOTA.Commonapi) - most important listed
export const localStorageModel = {
	darkMode: Boolean(),
	'auth_"shortLink"': {
		access_token: 'BEARER',
		expiration_time: 'UNIX_TIMESTAMP',
		tenant_id: 'ARRAY',
	},
}
