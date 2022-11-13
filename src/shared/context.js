import { createContext } from 'react'
import { toast } from 'react-toastify'

var checkError = (data) => {
	if (data.ok) {
		return toast.success(data.message)
	} else {
		return toast.error(data.message)
	}
}

export const Context = createContext({
	apiServer: String,
	auth: Object,
	changeTenant: () => {},
	checkError: checkError,
	firstLoading: Boolean,
	login: () => {},
})
