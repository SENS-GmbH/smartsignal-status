/**
 * Get the value from Local Storage for a given key
 * @function getLS
 * @param {string} key - The key of the value to retrieve
 * @returns {string|null} - The value associated with the given key, or null if not found
 */
export const getLS = (key) => {
	return localStorage.getItem(key)
}

/**
 * Save a value to Local Storage for a given key
 * @function saveLS
 * @param {string} key - The key to associate with the value
 * @param {*} value - The value to save to Local Storage
 */
export const saveLS = (key, value) => {
	var newValue = typeof value === 'string' ? value : JSON.stringify(value)
	localStorage.setItem(key, newValue)
}

/**
 * Remove a value from Local Storage for a given key
 * @function removeLS
 * @param {string} key - The key of the value to remove
 */
export const removeLS = (key) => {
	localStorage.removeItem(key)
}
