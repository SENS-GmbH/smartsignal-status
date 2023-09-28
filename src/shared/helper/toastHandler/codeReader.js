import { toast } from 'react-toastify'

/**
 * Combine toast with success path
 *
 * @param {Function} t - Translation function
 * @param {String} path - from the codeReader or checkToast-Handler
 * @param {Object} [params] - Additionally params for translation
 */
const success = (t, path, params) => {
	toast.success(t(`success.${path}`, params))
}
/**
 * Combine toast with error path
 *
 * @param {Function} t - Translation function
 * @param {String} path - from the codeReader or checkToast-Handler
 * @param {Object} [params] - Additionally params for translation
 */
const error = (t, path, params) => {
	toast.error(t(`error.${path}`, params))
}

/**
 * Explanation of all error codes across the application.
 * First two digits are reserved for the topic is the error. (documentation of every topic inside of the switch)
 * The third digit is reserved, what type of toast should be displayed. (0 = error, 1 = success)
 * The last two are reserved for the specific issue in a topic.
 *
 * @param {Function} t - Translation function
 * @param {Number} code - Given Code from the application
 * @param {Object} [params] - Additionally params for translation
 */

const codeReader = (t, code, params) => {
	switch (code) {
		// 10xxx - general errors
		case 10001:
			// IOTA-session ran out
			error(t, 'all.sessionTimeOut')
			break
		case 10002:
			// Code is NaN
			error(t, 'all.somethingWentWrong')
			break
		case 10003:
			// Wrong Digits
			error(t, 'all.wrongDigits', params)
			break

		// 11xxx - Login
		case 11002:
			// Invalid credentials were sent
			error(t, 'login.invalidCredentials')
			break
		case 11003:
			// No credentials was found in the input
			error(t, 'login.noCredentials')
			break
		case 11004:
			// Enter mail address for resetting password
			error(t, 'login.enterMail')
			break
		case 11005:
			// Something went wrong logging in
			error(t, 'login.noLogin')
			break
		case 11180:
			// password has been resetted Successfully
			// Successfully sent resetPassword to API
			success(t, 'login.resetPassword')
			break
		case 11081:
			// No User was found
			error(t, 'login.noUser')
			break
		case 11082:
			// Some other error occoured on trying to reset password
			error(t, 'login.noPasswordReset')
			break

		// 12xxx - Tenants
		case 12001:
			// There was no tenants found with the given search input
			error(t, 'tenant.noTenants')
			break
		case 12002:
			// Too less charactors was entered in the Input field for searching a tenant
			error(t, 'tenant.tooLessChars', params)
			break
		case 12003:
			// There was a problem loading the tenants after searching for them
			error(t, 'tenant.searchDelayInput')
			break
		case 12004:
			// There was a problem loading the tenants automatically
			error(t, 'tenant.autoLoad')
			break
		case 12005:
			// There was a problem finding the tenant
			error(t, 'tenant.findTenant')
			break

		// 13xxx - Devices
		case 13001:
			// There was a problem loading the devices with the given tenant id
			error(t, 'devices.loadDevices')
			break
		case 13002:
			// There was a problem loading a single devices
			error(t, 'devices.loadOneDevice')
			break
		case 13003:
			// Device doesn't belong to this tenant(Id)
			error(t, 'devices.wrongTenant')
			break
		case 13004:
			// Devicetype wasn't found
			error(t, 'devices.noDeviceType')
			break

		// 14xxx - Profile
		case 14001:
			// There was a problem loading the profile
			error(t, 'profile.noProfileFound')
			break

		// 15xxx - Device Attributes
		case 15101:
			// All attributes were saved to IOTA successfully
			success(t, 'attributes.successfullyUpdated')
			break
		case 15002:
			// Failed to save attributes in IOTA
			error(t, 'attributes.failedSaveAttributes')
			break
		case 15003:
			// Installation Place must be set
			error(t, 'attributes.noInstallationPlace')
			break

		default:
			// Unknown Code
			error(t, 'all.unknownCode', { code: code })
			break
	}
}

export default codeReader
