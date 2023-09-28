import React, { Component } from 'react'

// DOKU:

export default class Listed extends Component {
	state = {}

	componentDidMount = () => {
		this.props.appControlled.forEach((type) => {
			this.setState({ [type.displayname]: type.value })
		})
	}

	render() {
		return (
			<ul className="pt-3 space-y-2">
				{Object.entries(this.state).map((input, i) => (
					<li key={i}>
						<p>
							{input[0]}: {input[1]}
						</p>
					</li>
				))}
			</ul>
		)
	}
}
