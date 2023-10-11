import React, { Component } from 'react'

// DOKU:

export default class Headline extends Component {
	render() {
		return (
			<>
				<h2 className="text-center text-xl md:text-3xl mb-2">
					{this.props.children}
				</h2>
				{this.props.hr && <hr className="mb-2 xxs:mb-4" />}
			</>
		)
	}
}
