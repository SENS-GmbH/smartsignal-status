import { success, error } from './checkToast'

/**
 * Explanation of all error codes across the application.
 * First two digits are reserved for the topic is the error. (documentation of every topic inside of the switch)
 * The third digit is reserved, what type of toast should be displayed. (0 = error, 1 = success)
 * The last two are reserved for the specific issue in a topic.
 *
 * @param {Number} code - Given Code from the application
 */
const codeReader = (code) => {
	switch (code) {
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

		default:
			// Unknown Code
			error('all.unknownCode')
			break
	}
}

export default codeReader
