import React, { Component } from 'react'
import Leaflet from '../../../../../shared/components/Leaflet'
import { attributesSorting } from '#helper/showData'

// DOKU:

export default class Listed extends Component {
	state = {}

	componentDidMount = () => {
		attributesSorting(this.props.appControlled).forEach((type) => {
			this.setState({ [type.displayname]: type.value })
		})
	}

	findIt = (value) => {
		return this.props.appControlled.find((a) => a.name === value).value
	}

	// TODO: Karte mit aktueller Position anzeigen in "listed"

	render() {
		return (
			<div>
				<ul className="py-3 space-y-2">
					{Object.entries(this.state).map((input, i) => (
						<li key={i}>
							<p>
								{input[0]}: {input[1]}
							</p>
						</li>
					))}
				</ul>
				<Leaflet
					latitude={this.findIt('latitude')}
					longitude={this.findIt('longitude')}
				/>
			</div>
		)
	}
}
