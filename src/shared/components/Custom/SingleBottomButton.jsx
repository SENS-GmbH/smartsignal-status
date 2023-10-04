import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'

// DOKU:

export default class SingleBottomButton extends Component {
	render() {
		const { icon, onClick } = this.props
		return (
			<div
				onClick={onClick}
				className="cursor-pointer shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-test dark:bg-primary flex items-center justify-center"
			>
				<FontAwesomeIcon icon={icon} size="2xl" />
			</div>
		)
	}
}
