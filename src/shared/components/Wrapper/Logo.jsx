import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * A reusable logo component that displays an image.
 *
 * @component
 * @example
 * return (
 *   <Logo
 *     className="logo"
 *     instance={{ Logo: 'logo.png', Button: 'Home' }} (or myInstance())
 *   />
 * );
 */
export default class Logo extends Component {
	/**
	 * @typedef {Object} PropTypes
	 * @property {string} [className='logo'] - The CSS class for the logo element.
	 * @property {Object} [instance] - The configuration details for the logo.
	 * @property {string} instance.Logo - The filename for the logo image.
	 * @property {string} instance.Button - The filename for the logo button.
	 * @property {string} [src='default-logo.png'] - The filename for the logo image in case instance prop is not provided.
	 * @property {string} [alt='Default logo'] - The alternative text to display for the logo image.
	 */
	static propTypes = {
		className: PropTypes.string,
		instance: PropTypes.shape({
			Logo: PropTypes.string,
			Button: PropTypes.string,
		}),
		src: PropTypes.string,
		alt: PropTypes.string,
	}
	static defaultProps = {
		className: 'logo',
		src: 'default-logo.png',
		alt: 'Default logo',
	}

	render() {
		return (
			<>
				{this.props.instance && (
					<img
						className={this.props.className}
						src={require('../../media/' + this.props.instance.Logo)}
						alt={this.props.instance.Button}
					/>
				)}
				{/* TODO: varible Logos for Breadcrumb */}
				{!this.props.instance && (
					<img
						className={this.props.className}
						src={this.props.src}
						alt={this.props.alt}
					/>
				)}
			</>
		)
	}
}
