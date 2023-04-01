import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
	 * @typedef {Object} PropTypes
	 * @property {string} [color] - Color of the progress bar.
	 * @property {number} progress - Percentage of the progress bar (only allowed from 1 to 100).
	 */
	static propTypes = {
		color: PropTypes.string,
		progress: PropTypes.number.isRequired,
	}

	static defaultProps = {
		color: 'blue',
		progress: 1,
	}

	render() {
		const { color, progress, ...props } = this.props

		return (
			<LoadingScreen {...props}>
				<div className="w-full">
					<Progress progress={progress} color={color} />
				</div>
			</LoadingScreen>
		)
	}
}

// Child: Spinner
LoadingScreen.Spinner = class SpinnerClass extends Component {
	render() {
		return (
			<LoadingScreen {...this.props}>
				<Spinner size="xl" />
			</LoadingScreen>
		)
	}
}

export { LoadingScreen }
