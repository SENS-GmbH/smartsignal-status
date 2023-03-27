import checkError from "./checkError"

export const findTenant = async (id, context) => {
	var obj = ''
	if (context.tenants === null) {
		try {
			var data = await context.fetchOneTenant(id)
			obj = data
		} catch (error) {
			context.changeNotFound()
			checkError(error.error_description)
		}
	} else if (
		context.tenants.findIndex((i) => i.id.toString() === id) !== -1
	) {
		obj = context.tenants.find((tenant) => tenant.id.toString() === id)
	} else {
		obj = context.recentTenants.find(
			(tenant) => tenant.id.toString() === id
		)
	}
	return obj
}
