import { createContext } from 'react'
import { toast } from 'react-toastify'

var checkError = (data) => {
	if (data.ok) {
		return toast.success(data.message)
	} else {
		return toast.error(data.message)
	}
}

console.log(process.env.REACT_APP_CLIENT);

var client = process.env.REACT_APP_CLIENT

export const Context = createContext({
	apiServer: String,
	auth: Object,
	changeTenant: () => {},
	checkError: checkError,
	client: client,
	firstLoading: Boolean,
	login: () => {},
})
