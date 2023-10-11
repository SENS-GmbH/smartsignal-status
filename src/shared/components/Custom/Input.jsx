import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { focusColor } from '#helper/colors.js'

/**
 * React component for a custom input element.
 *
 * @component
 * @example
 * <Input
 * name="email"
 * type="email"
 * required={true}
 * onChange={handleEmailChange}
 * value={email}
 * className="custom-input-class"
 * icon={<FontAwesomeIcon icon={faEnvelope} />}
 * error={isEmailError}
 * success={isEmailValid}
 * color="blue"
 * >
 * Email
 * </Input>
 */
export default class Input extends Component {
	/**
	 * @typedef {Object} PropTypes
	 * @property {string} name - The name of the input element.
	 * @property {string} [type="text"] - The type of the input element.
	 * @property {boolean} [required=false] - Whether the input element is required or not.
	 * @property {Function} onChange - The function to be called when the input value changes.
	 * @property {string|number} value - The value of the input element.
	 * @property {string} [className=""] - The class name of the input element.
	 * @property {ReactNode} [icon] - The icon to be displayed inside the input element.
	 * @property {boolean} [error=false] - Whether the input value is in error state or not.
	 * @property {boolean} [success=false] - Whether the input value is in success state or not.
	 * @property {string} [color="blue"] - The color scheme for the input element.
	 * @property {ReactNode} children - The label for the input element.
	 */
	static propTypes = {
		name: PropTypes.string.isRequired,
		type: PropTypes.string,
		required: PropTypes.bool,
		onChange: PropTypes.func.isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		className: PropTypes.string,
		icon: PropTypes.element,
		error: PropTypes.bool,
		success: PropTypes.bool,
		color: PropTypes.string,
		children: PropTypes.node.isRequired,
	}
	static defaultProps = {
		type: 'text',
		required: false,
		className: '',
		error: false,
		success: false,
		color: 'blue',
	}

	/**
	 * Handles the 'Enter' keyup event.
	 * @param {KeyboardEvent} e - The keyboard event.
	 */
	exitEnter = (e) => {
		if (e.key === 'Enter') {
			document.getElementById(this.props.name).blur()
		}
	}

	render() {
		const {
			className,
			icon,
			name,
			type,
			required,
			value,
			children,
			onChange,
			error,
			success,
			color,
		} = this.props

		return (
			<div className={'relative h-11 w-full ' + className}>
				{icon && (
					<div className="absolute top-2/4 right-3 grid h-5 w-5 -translate-y-2/4 place-items-center dark:text-gray-400 text-gray-500">
						{icon}
					</div>
				)}
				<input
					id={name}
					type={type}
					required={required}
					name={name}
					onChange={onChange}
					onKeyUp={this.exitEnter}
					value={value}
					className={
						'!ring-0 peer h-full w-full rounded-md bg-transparent border border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent px-3 py-3 !pr-9 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border dark:placeholder-shown:border-gray-400 dark:placeholder-shown:border-t-gray-400 placeholder-shown:border-gray-500 placeholder-shown:border-t-gray-500 focus:border-2 focus:border-t-transparent dark:focus:border-t-transparent focus:!outline-0 disabled:border-0 disabled:bg-blue-gray-50 ' +
						focusColor(error, success, color).input
					}
					placeholder=" "
				/>
				<label
					htmlFor={name}
					className={
						"dark:text-gray-400 text-gray-500 before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-sm font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:dark:border-gray-400 before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 dark:after:border-gray-400 after:transition-all peer-placeholder-shown:text-md peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-200 " +
						focusColor(error, success, color).label
					}
				>
					{children + (required ? ' *' : '')}
				</label>
			</div>
		)
	}
}
