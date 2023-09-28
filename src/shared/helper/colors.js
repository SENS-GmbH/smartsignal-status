/**
 * @typedef {Object} ColorScheme
 * @property {string} label - The color scheme for the label.
 * @property {string} input - The color scheme for the input.
 */

/**
 * Gets the color scheme for the input element based on the current state.
 * @param {boolean} error If error color should be visible.
 * @param {boolean} success If success color should be visible.
 * @param {string} color Sets color to the current string.
 * @returns {ColorScheme} The color scheme for the input element.
 */
export const focusColor = (error, success, color) => {
	// Define default color values for the input and label
	let inputColor = 'focus:border-blue-400 dark:focus:border-blue-400'
	let labelColor =
		'peer-focus:before:border-blue-400 dark:peer-focus:before:border-blue-400 peer-focus:after:border-blue-400 dark:peer-focus:after:border-blue-400 peer-focus:text-blue-400 dark:peer-focus:text-blue-400'

	// Override default colors if error, success, or custom color is provided
	if (error) {
		inputColor = 'focus:border-red-400 dark:focus:border-red-400'
		labelColor =
			'peer-focus:before:border-red-400 dark:peer-focus:before:border-red-400 peer-focus:after:border-red-400 dark:peer-focus:after:border-red-400 peer-focus:text-red-400 dark:peer-focus:text-red-400'
	} else if (success) {
		inputColor = 'focus:border-green-400 dark:focus:border-green-400'
		labelColor =
			'peer-focus:before:border-green-400 dark:peer-focus:before:border-green-400 peer-focus:after:border-green-400 dark:peer-focus:after:border-green-400 peer-focus:text-green-400 dark:peer-focus:text-green-400'
	} else if (color) {
		inputColor = `focus:border-${color}-400 dark:focus:border-${color}-400`
		labelColor = `peer-focus:before:border-${color}-400 dark:peer-focus:before:border-${color}-400 peer-focus:after:border-${color}-400 dark:peer-focus:after:border-${color}-400 peer-focus:text-${color}-400 dark:peer-focus:text-${color}-400`
	}

	return { input: inputColor, label: labelColor }
}
