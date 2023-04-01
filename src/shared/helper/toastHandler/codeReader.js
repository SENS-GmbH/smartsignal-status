import { t } from 'i18next'
import { toast } from 'react-toastify'

/**
 * Combine toast with success path
 *
 * @param {String} path - from the codeReader or checkToast-Handler
 * @param {Object} [params] - Additionally params for translation
 */
const success = (path, params) => {
	toast.success(t(`success.${path}`, params))
}
/**
 * Combine toast with error path
 *
 * @param {String} path - from the codeReader or checkToast-Handler
 * @param {Object} [params] - Additionally params for translation
 */
const error = (path, params) => {
	toast.error(t(`error.${path}`, params))
}

/**
 * Explanation of all error codes across the application.
 * First two digits are reserved for the topic is the error. (documentation of every topic inside of the switch)
 * The third digit is reserved, what type of toast should be displayed. (0 = error, 1 = success)
 * The last two are reserved for the specific issue in a topic.
 *
 * @param {Number} code - Given Code from the application
 * @param {Object} [params] - Additionally params for translation
 */

const codeReader = (code, params) => {
	switch (code) {
		// 10xxx - general errors
		case 10001:
			// IOTA-session ran out
			error('all.sessionTimeOut')
			break
		case 10002:
			// Code is NaN
			error('all.somethingWentWrong')
			break
		case 10003:
			// Wrong Digits
			error('all.wrongDigits', params)
			break

		// 11xxx - Login
		case 11002:
			// Invalid credentials were sent
			error('login.invalidCredentials')
			break
		case 11003:
			// No credentials was found in the input
			error('login.noCredentials')
			break
		case 11004:
			// Enter mail address for resetting password
			error('login.enterMail')
			break
		case 11005:
			// Something went wrong logging in
			error('login.noLogin')
			break
		case 11180:
			// Successfully sent resetPassword to API
			success('login.resetPassword')
			break
		case 11081:
			// No User was found
			error('login.noUser')
			break
		case 11082:
			// Some other error occoured on trying to reset password
			error('login.noPasswordReset')
			break

		// 12xxx - Tenants
		case 12001:
			// There was no tenants found with the given search input
			error('tenant.noTenants')
			break
		case 12002:
			// Too less charactors was entered in the Input field for searching a tenant
			error('tenant.tooLessChars')
			break
		case 12003:
			// There was a problem loading the tenants after searching for them
			error('tenant.searchDelayInput')
			break
		case 12004:
			// There was a problem loading the tenants automatically
			error('tenant.autoload')
			break
		case 12005:
			// There was a problem finding the tenant
			error('tenant.findTenant')
			break

		// 13xxx - Devices
		case 13001:
			// There was a problem loading the devices with the given tenant id
			error('devices.loadDevices')
			break
		case 13002:
			// There was a problem loading a single devices
			error('devices.loadOneDevice')
			break

		case 14001:
			// There was a problem loading a single devices
			error('profile.noProfileFound')
			break

		default:
			// Unknown Code
			error('all.unknownCode')
			break
	}
}

export default codeReader
