import React, { Component } from 'react'

// DOKU:

export default class Toggle extends Component {
	render() {
		const { isChecked, onChange, children } = this.props
		return (
			<>
				<label className="relative inline-flex cursor-pointer select-none items-center w-full justify-start my-2">
					<input
						type="checkbox"
						checked={isChecked}
						onChange={onChange}
						className="sr-only"
					/>
					<span className="flex items-center  justify-end text-right">
						{children}
					</span>
					<span
						className={`slider mx-4 flex h-5 w-[40px] items-center rounded-full p-1 duration-200 ${
							isChecked ? 'bg-green-400' : 'bg-gray-700'
						}`}
					>
						<span
							className={`dot h-3 w-3 rounded-full bg-white duration-200${
								isChecked ? ' translate-x-[18px]' : ''
							}`}
						></span>
					</span>
				</label>
			</>
		)
	}
}
