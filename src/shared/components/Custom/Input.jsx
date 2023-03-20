import React, { Component } from 'react'

/**
 * Input
 *
 * label: String
 * icon: Component
 *
 */
export default class Input extends Component {
	// Error: Rot
	// Custom Color: this.props.color
	//

	focusColor = () => {
		var { error, success, color } = this.props
		if (error) {
			return {
				label: 'peer-focus:before:border-pink-500 dark:peer-focus:before:border-pink-500 peer-focus:after:border-pink-500 dark:peer-focus:after:border-pink-500 peer-focus:text-pink-500 dark:peer-focus:text-pink-500',
				input: 'focus:border-pink-500 dark:focus:border-pink-500',
			}
		}
		if (success) {
			return {
				label: 'peer-focus:before:border-green-500 dark:peer-focus:before:border-green-500 peer-focus:after:border-green-500 dark:peer-focus:after:border-green-500 peer-focus:text-green-500 dark:peer-focus:text-green-500',
				input: 'focus:border-green-500 dark:focus:border-green-500',
			}
		}
		if (color !== undefined) {
			return color
		}
		return {
			label: 'peer-focus:before:border-blue-400 dark:peer-focus:before:border-blue-400 peer-focus:after:border-blue-400 dark:peer-focus:after:border-blue-400 peer-focus:text-blue-400 dark:peer-focus:text-blue-400',
			input: 'focus:border-blue-400 dark:focus:border-blue-400',
		}
	}

	exitEnter = (e) => {
		if (e.key === 'Enter') {
			document.getElementById(this.props.name).blur()
		}
	}

	render() {
		return (
			<div className={'relative h-11 w-full ' + this.props.className}>
				{this.props.icon && (
					<div className="absolute top-2/4 right-3 grid h-5 w-5 -translate-y-2/4 place-items-center dark:text-gray-400 text-gray-500">
						{this.props.icon}
					</div>
				)}
				<input
					id={this.props.name}
					type={this.props.type}
					required={this.props.required}
					name={this.props.name}
					onChange={this.props.onChange}
					onKeyUp={this.exitEnter}
					value={this.props.value}
					className={
						'!ring-0 peer h-full w-full rounded-md bg-transparent border border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent px-3 py-3 !pr-9 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border dark:placeholder-shown:border-gray-400 dark:placeholder-shown:border-t-gray-400 placeholder-shown:border-gray-500 placeholder-shown:border-t-gray-500 focus:border-2 focus:border-t-transparent dark:focus:border-t-transparent focus:!outline-0 disabled:border-0 disabled:bg-blue-gray-50 ' +
						this.focusColor().input
					}
					placeholder=" "
				/>
				<label
					htmlFor={this.props.name}
					className={
						"dark:text-gray-400 text-gray-500 before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-sm font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:dark:border-gray-400 before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 dark:after:border-gray-400 after:transition-all peer-placeholder-shown:text-md peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-200 " +
						this.focusColor().label
					}
				>
					{this.props.children + (this.props.required ? '*' : '')}
				</label>
			</div>
		)
	}
}
