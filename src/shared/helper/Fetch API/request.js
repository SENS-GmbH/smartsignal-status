// import checkToast from '../toastHandler/checkToast'
// DOKU:
export const defaultFetch = async (url, options, cb) => {
	try {
		var resp = await fetch(url, options)
		var respJson = null
		if (resp.status === 204) {
			respJson = { status: resp.status }
		} else {
			respJson = await resp.json()
		}
		if (resp.status === 401) {
			throw respJson
		}
		if (resp.status !== 200 && resp.status !== 201 && resp.status !== 204) {
			respJson.status = resp.status
			throw respJson
		}
		return respJson
	} catch (error) {
		cb.bind(this)
		// cb(this)
		return error
	}
}