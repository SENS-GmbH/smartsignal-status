import { toast } from 'react-toastify'

const checkError = (data) => {
	if (typeof data === 'string') {
		toast.error(data)
	}
	if (data.ok) {
		toast.success(data.message)
	} else if (data.error_description) {
		toast.error(data.error_description)
	} else {
		toast.error(data)
	}
}

export default checkError
