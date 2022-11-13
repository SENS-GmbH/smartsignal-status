import React from 'react'
import { CircleSpinner } from 'react-spinners-kit'

/**
 * Loading
 *
 * loading: Boolean
 * center: Boolean
 * className: String
 * children: <>
 */
export default class Loading extends React.Component {
	render() {
		return (
			<>
				{this.props.loading && (
					<div
						className={
							(this.props.center ? 'h-screen ' : '') +
							'flex justify-center items-center dark:bg-dark-900 pt-8' +
							(this.props.className
								? ' ' + this.props.className
								: '')
						}
					>
						<CircleSpinner
							size={this.props.center ? 60 : 60}
							color="#686769"
							loading={this.props.loading}
						/>
					</div>
				)}
				{!this.props.loading && this.props.children}
			</>
		)
	}
}
