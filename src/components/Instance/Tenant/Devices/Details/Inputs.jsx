import React, { Component } from 'react'
import Input from '#comp/Custom/Input'
import Context from '#context'
import { onChange } from '#helper/onChange'
import Select from '../../../../../shared/components/Custom/Select'
// import checkToast from '#toast'

// DOKU:

export default class Inputs extends Component {
	static contextType = Context

	state = {}

	findCatalogue = (cata, name) => {
		let myReturn = {}
		const test = cata.find((c) => c.name === name).values
		test.forEach((t) => {
			myReturn[t.name] = t.value
		})
		return myReturn
	}

	componentDidMount = () => {
		this.props.appControlled.forEach((type) => {
			this.setState({ [type.displayname]: type.value })
		})
		navigator.geolocation.getCurrentPosition(function (position) {
			console.log('Latitude is :', position.coords.latitude)
			console.log('Longitude is :', position.coords.longitude)
		})
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevState !== this.state) {
			this.props.updateParent(this.state)
		}
	}

	// TODO: 1) Modal programmieren, Open Modal und location bestätigen, ...
	// TODO: Installation Place Logic für "doppelte" Installationsorte, ...

	// TODO: Vernünftiges Inputsystem, damit gespeichert werden kann!

	// TODO: Wenn installation place "Sonstiges" dann Installation_place 2 anzeigen.

	render() {
		return (
			<div className="flex space-y-5 flex-col mt-4">
				{Object.entries(this.state).map((input, i) => (
					<div key={i}>
						{this.props.appControlled[i]?.catalogue ? (
							<Select
								name={input[0]}
								options={this.findCatalogue(
									this.props.catalogue,
									this.props.appControlled[i].catalogue
								)}
								defaultValue={input[1]}
								onChange={(e) => {
									onChange(e, (state) => this.setState(state))
								}}
							>
								{input[0]}
							</Select>
						) : (
							<Input
								name={input[0]}
								onChange={(e) => {
									onChange(e, (state) => this.setState(state))
								}}
								value={input[1] === null ? '' : input[1]}
							>
								{input[0]}
							</Input>
						)}
					</div>
				))}
			</div>
		)
	}
}
