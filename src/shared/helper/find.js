import checkToast from './toastHandler/checkToast'

/**
 * Looks for a tenant with a given id inside the context.tenants array or makes an API request if the array is not defined.
 * If the tenant is found, it returns an object with the tenant information, otherwise it sets the notFound flag in the context and shows an error toast.
 * @param {Function} t - Translation function
 * @param {string|number} id - The ID of the tenant to look for.
 * @param {Context} context - The context object containing the tenants array and methods to make an API request.
 * @returns {Object} - An object containing the tenant information.
 * @throws {Error} - If an error occurs while making an API request.
 */
export const findTenant = async (t, id, context) => {
	let obj = {}

	if (!context.tenants) {
		try {
			obj = await context.fetchOneTenant(id)
			return obj
		} catch (error) {
			context.changeNotFound()
			checkToast(t, 12005, error)
		}
	}

	const tenant = context.tenants?.find((i) => i.id.toString() === id)
	obj = tenant || context.recentTenants.find((i) => i.id.toString() === id)
	return obj
}
