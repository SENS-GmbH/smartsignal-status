/**
 *
 * Defines the props accepted by the Logo component.
 * @typedef {Object} PropTypes
 * @property {string} [className='logo'] - The CSS class for the logo element.
 * @property {Object} [instance] - The configuration details for the logo.
 * @property {string} instance.Logo - The filename for the logo image.
 * @property {string} instance.Button - The filename for the logo button.
 * @property {string} [src='default-logo.png'] - The filename for the logo image in case instance prop is not provided.
 * @property {string} [alt='Default logo'] - The alternative text to display for the logo image.
 */

/**
 *
 * Defines the default props for the Logo component.
 * @typedef {Object} defaultProps
 * @property {string} [className='logo'] - The default CSS class for the logo element.
 * @property {string} [src='default-logo.png'] - The default filename for the logo image in case instance prop is not provided.
 * @property {string} [alt='Default logo'] - The default alternative text to display for the logo image.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * A reusable logo component that displays an image.
 *
 * @class
 * @extends Component
 * @property {Object} props - The props object.
 * @property {string} props.className - The class name of the image element.
 * @property {Object} [props.instance] - The instance object containing the logo image and button text to be displayed. If not provided, the default logo image and alt text will be displayed.
 * @property {string} props.src - The URL of the default logo image to be displayed if `instance` is not provided.
 * @property {string} props.alt - The alt text of the default logo image to be displayed if `instance` is not provided.
 * @returns {JSX.Element} - A JSX element that renders the logo image.
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
	 *
	 * A React component that displays a logo image.
	 * @component
	 * @example
	 * <Logo className="logo" instance={{ Logo: "logo.png", Button: "logo-button.png" }} alt="Company Logo" />
	 * @type {PropTypes}
	 * @type {defaultProps}
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
