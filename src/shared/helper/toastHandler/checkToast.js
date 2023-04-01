import { t } from 'i18next'
import { toast } from 'react-toastify'
import codeReader from './codeReader'

/**
 * Combine toast with success path
 *
 * @param {String} path - from the codeReader or checkToast-Handler
 * @param {Object} [params] - Additionally params for translation
 */
export const success = (path, params) => {
	toast.success(t(`success.${path}`, params))
}
/**
 * Combine toast with error path
 *
 * @param {String} path - from the codeReader or checkToast-Handler
 * @param {Object} [params] - Additionally params for translation
 */
export const error = (path, params) => {
	toast.error(t(`error.${path}`, params))
}

/**
 *  Main function for handling errors
 *
 * @param {Number} code - Given Code from the application
 * @param {Object} [data] - response from IOTA's Rest-API
 * @param {Number} [regexLength=5] - length of the regex pattern to test the code against
 */
const checkToast = (code, data, regexLength = 5) => {
	// If IOTA-session ran out
	if (data?.error_description === 'The token cannot be found in the Redis!') {
		error('all.sessionTimeOut')
		return
	}

	// If code is not a number
	if (typeof code !== 'number') {
		console.log(code, data)
		error('all.somethingWentWrong')
		return
	}

	// Checks if code has 'regexLength' digits and is a number
	const regex = new RegExp(`^\\d{${regexLength}}$`)
	if (!regex.test(code.toString())) {
		error('all.wrongDigits', { code: code, maxLength: regexLength })
		return
	}

	// Default error handlling
	codeReader(code)
}

export default checkToast
