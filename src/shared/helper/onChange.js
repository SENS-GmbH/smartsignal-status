export const onChange = (e, cb) => {
	var name = e.target.name
	var value = e.target.value
	cb({ [name]: value })
}
