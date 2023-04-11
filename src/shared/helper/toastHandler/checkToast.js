import codeReader from './codeReader'

/**
 *  Main function for handling errors
 *
 * @param {Function} t - Translation function
 * @param {Number} code - Given Code from the application
 * @param {Object} [data] - response from IOTA's Rest-API
 * @param {Object} [params] - Additionally params for translation
 * @param {Object} [regexLength=5] - length of the regex pattern to test the code against
 */
const checkToast = (t, code, data, params, regexLength = 5) => {
	// If IOTA-session ran out
	if (data?.error_description === 'The token cannot be found in the Redis!') {
		codeReader(t, 10001)
		return
	}

	// If code is not a number
	if (typeof code !== 'number') {
		console.log(code, data)
		codeReader(t, 10002)
		return
	}

	// Checks if code has 'regexLength' digits and is a number
	const regex = new RegExp(`^\\d{${regexLength}}$`)
	if (!regex.test(code.toString())) {
		codeReader(t, 10003, { code: code, maxLength: regexLength })
		return
	}

	// Default error handlling
	codeReader(t, code, params)
}

export default checkToast
