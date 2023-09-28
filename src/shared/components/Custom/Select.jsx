import React, { Component } from 'react'
import Context from '#context'
import { focusColor } from '#helper/colors'

// DOKU:

export default class Select extends Component {
	static contextType = Context

	render() {
		const {
			className,
			children,
			required,
			error,
			success,
			color,
			defaultValue,
			onChange,
			name,
			options
		} = this.props

		return (
			<div className={'relative h-11 w-full ' + className}>
				<select
					name={name}
					className={
						'!ring-0 peer h-full w-full rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent px-3 pt-3 pb-2.5 !pr-9 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border dark:placeholder-shown:border-gray-400 dark:placeholder-shown:border-t-gray-400 placeholder-shown:border-gray-500 placeholder-shown:border-t-gray-500 focus:border-2 focus:border-t-transparent dark:focus:border-t-transparent focus:!outline-0 disabled:border-0 disabled:bg-blue-gray-50 ' +
						focusColor(error, success, color).input
					}
					defaultValue={defaultValue}
					onChange={onChange}
				>
					{Object.entries(options).map((option, i) => (
						<option key={i} value={option[1]} name={option[0]}>
							{option[0]}
						</option>
					))}
				</select>
				<label
					className={
						"dark:text-gray-400 text-gray-500 before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-sm font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:dark:border-gray-400 before:border-gray-500 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-gray-500 dark:after:border-gray-400 after:transition-all peer-placeholder-shown:text-md peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-gray-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-200 " +
						focusColor(error, success, color).label
					}
				>
					{children + (required ? '*' : '')}
				</label>
			</div>
		)
	}
}
