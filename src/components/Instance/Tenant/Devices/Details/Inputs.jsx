import React, { Component } from 'react'
import Input from '../../../../../shared/components/Custom/Input'
import { Context } from '../../../../../shared/context'

// DOKU:

export default class Inputs extends Component {
	static contextType = Context

	state = {}

	componentDidMount = () => {
		this.props.appControlled.forEach((type) => {
			this.setState({ [type.displayname]: type.value })
		})
	}

	// TODO: Vernünftiges Inputsystem, damit gespeichert werden kann!

	render() {
		return (
			<div className="flex space-y-5 flex-col mt-4">
				{Object.entries(this.state).map((input, i) => (
					<div key={i}>
						<Input
							name={input[0]}
							onChange={this.props.onChange}
							value={input[1] === null ? '' : input[1]}
						>
							{input[0]}
						</Input>
					</div>
				))}
			</div>
		)
	}
}
