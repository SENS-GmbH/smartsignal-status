/**
 * A utility function that simplifies setting the state of a component by handling the change event
 * of an input and calling a callback function with the updated state object.
 *
 * @param {Object} e - The event object passed to the change event handler
 * @param {Function} cb - A callback function that takes the updated state object and updates the component state
 */
export const onChange = (e, cb) => {
	const { name, value } = e.target
	cb({ [name]: value })
}
