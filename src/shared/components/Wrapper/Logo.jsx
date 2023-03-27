import React, { Component } from 'react'

/**
 * Logo
 *
 * className: String
 * instance: Object (Instance)
 */
export default class Logo extends Component {
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
