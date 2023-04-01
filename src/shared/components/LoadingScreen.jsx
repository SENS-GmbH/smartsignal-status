import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Context } from '../context'

import { Progress, Spinner } from 'flowbite-react'

/**
 * React component for a loading element (LoadingScreen Parent).
 *
 * @component
 * @example
 * <LoadingScreen.Spinner
 * fullScreen={true}
 * className="custom-input-class"
 * color="red"
 * />
 */
export default class LoadingScreen extends Component {
	/**
	 * @typedef {Object} PropTypes
	 * @property {string} [className=""] - The class name of the LoadingScreen element.
	 * @property {boolean} [fullScreen=false] - Whether the LoadingScreen should be fullScreen or not.
	 * @property {ReactNode} children - The child nodes to be rendered.
	 */
	static propTypes = {
		className: PropTypes.string,
		fullScreen: PropTypes.bool,
		children: PropTypes.node.isRequired,
	}
	static defaultProps = {
		className: '',
		fullScreen: false,
	}

	render() {
		const { fullScreen, className, children } = this.props
		const containerClassName = `${
			fullScreen ? 'h-screen' : ''
		} flex justify-center items-center ${className || ''}`

		return <div className={containerClassName}>{children}</div>
	}
}

// Child: Progress Bar
LoadingScreen.Progress = class ProgressClass extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {number} progress - Percentage of the progress bar (only allowed from 1 to 100).
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {string} [color] - Color of the progress bar.
	 */
	static propTypes = {
		color: PropTypes.string,
	}

	static defaultProps = {
		color: 'blue',
	}

	render() {
		const { color, ...loadingScreenProps } = this.props
		const { progress } = this.context

		return (
			<LoadingScreen {...loadingScreenProps}>
				<div className="w-full">
					<Progress progress={progress} color={color} />
				</div>
			</LoadingScreen>
		)
	}
}

// Child: Spinner
LoadingScreen.Spinner = class SpinnerClass extends Component {
	/**
	 * @typedef {Object}
	 * @property {string} [color] - Color of the progress bar.
	 */
	static propTypes = {
		color: PropTypes.string,
	}

	static defaultProps = {
		color: 'blue',
	}

	render() {
		const { color, ...loadingScreenProps } = this.props
		return (
			<LoadingScreen {...loadingScreenProps}>
				<Spinner size="xl" color={color} />
			</LoadingScreen>
		)
	}
}

export { LoadingScreen }
