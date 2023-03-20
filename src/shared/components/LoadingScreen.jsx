import React, { Component } from 'react'
import { Context } from '../context'
import { Progress, Spinner } from 'flowbite-react'

/**
 * LoadingScreen
 *
 * fullScreen
 */
export default class LoadingScreen extends Component {
	render() {
		return (
			<div
				className={
					(this.props.fullScreen ? 'h-screen ' : '') +
					'flex justify-center items-center' +
					(this.props.className ? ' ' + this.props.className : '')
				}
			>
				{this.props.children}
			</div>
		)
	}
}

LoadingScreen.Progress = class ProgressClass extends Component {
	static contextType = Context
	render() {
		return (
			<LoadingScreen className={this.props.className}>
				<div className="w-1/2">
					<Progress
						progress={this.context.progress}
						size="xl"
						color="yellow"
					/>
				</div>
			</LoadingScreen>
		)
	}
}

LoadingScreen.Spinner = class SpinnerClass extends Component {
	static contextType = Context
	render() {
		return (
			<LoadingScreen className={this.props.className}>
				<Spinner aria-label="Extra large spinner example" size="xl" />
			</LoadingScreen>
		)
	}
}

export { LoadingScreen }
