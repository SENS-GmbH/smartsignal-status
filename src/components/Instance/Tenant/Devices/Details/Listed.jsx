import React, { Component } from 'react'
import Leaflet from '../../../../../shared/components/Leaflet'
import Context from '#context'
import { attributesSorting } from '#helper/showData'

// DOKU:

export default class Listed extends Component {
	static contextType = Context

	state = {}

	componentDidMount = () => {
		attributesSorting(this.props.appControlled).forEach((type) => {
			var input = type.value
			if (this.props.inputs) {
				var myNewInput = this.props.inputs.find(
					(input) => input.displayname === type.displayname
				)
				if (myNewInput) {
					input = myNewInput.value
				}
			}
			this.setState({ [type.displayname]: input })
		})
	}

	findIt = (value) => {
		return this.props.appControlled.find((a) => a.name === value)?.value
	}

	render() {
		return (
			<div>
				<ul className="space-y-2">
					{this.props.serial && <li>MAC: {this.props.serial}</li>}
					{Object.entries(this.state).map((input, i) => (
						<li key={i}>
							<p>
								{input[0]}: {input[1]}
							</p>
						</li>
					))}
				</ul>
				{!this.context.showModal && (
					<div className="mt-4">
						<Leaflet
							latitude={this.findIt('latitude')}
							longitude={this.findIt('longitude')}
							hr
						/>
					</div>
				)}
			</div>
		)
	}
}
