import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * React component for the Scroll Button.
 *
 * @component
 * @example
 * <ScrollButton
 * active={false}
 * truncate
 * onClick={this.someHandler()}
 * >
 * Name
 * </ScrollButton>
 */
export default class ScrollButton extends Component {
	/**
	 * @typedef {Object} PropTypes
	 * @property {boolean} active - determines if the button is active
	 * @property {boolean} truncate - determines if the text should be truncated
	 * @property {function} onClick - onClick handler for the button
	 * @property {ReactNode} children - the content of the button
	 */
	static propTypes = {
		active: PropTypes.bool,
		truncate: PropTypes.bool,
		onClick: PropTypes.func,
		children: PropTypes.node.isRequired,
	}
	static defaultProps = {
		active: false,
		truncate: false,
		onClick: () => {},
	}

	render() {
		const { active, truncate, onClick, children } = this.props
		const activeClass = active ? 'bg-test dark:bg-primary ' : ''
		const sizeClass = truncate ? 'max-w-[128px] truncate ' : 'min-w-fit '
		const borderClass =
			'border dark:border-gray-600 py-1 px-2 rounded-md text-center cursor-pointer'

		return (
			<div
				className={`${activeClass}${sizeClass}${borderClass}`}
				onClick={(e) => {
					e.preventDefault()
					onClick()
				}}
			>
				{children}
			</div>
		)
	}
}
