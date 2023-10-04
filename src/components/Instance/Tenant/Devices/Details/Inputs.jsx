import React, { Component } from 'react'
import Input from '#comp/Custom/Input'
import Context from '#context'
import { onChange } from '#helper/onChange'
import Select from '#comp/Custom/Select'
import { attributesSorting } from '#helper/showData'
// import checkToast from '#toast'

// DOKU:

export default class Inputs extends Component {
	static contextType = Context

	state = {}

	findCatalogue = (cata, name) => {
		let myReturn = {}
		cata.find((c) => c.name === name).values.forEach((t) => {
			myReturn[t.name] = t.value
		})
		return myReturn
	}

	componentDidMount = () => {
		navigator.geolocation.getCurrentPosition(function (position) {
			console.log('Latitude is :', position.coords.latitude)
			console.log('Longitude is :', position.coords.longitude)
		})
	}

	// TODO: Latitude/Longitude Logik & Installationsort Logik + Modal programmieren.

	// TODO: 1) Modal programmieren, Open Modal und location bestätigen, ...

	// TODO: Installation Place Logic für "doppelte" Installationsorte, ...

	// TODO: Vernünftiges Inputsystem, damit gespeichert werden kann!

	// TODO: Expired authentication funktioniert nicht mehr! ÜBERARBEITEN!

	render() {
		return (
			<div className="flex space-y-5 flex-col mt-4">
				{attributesSorting(this.props.inputs, true).map((input, i) => (
					<div key={i + '_Inputs'}>
						{this.props.appControlled.find(
							(appC) => appC.name === input.name
						)?.catalogue ? (
							<Select
								name={input.name}
								options={this.findCatalogue(
									this.props.catalogue,
									input.catalogue,
									input
								)}
								defaultValue={input.value}
								onChange={(e) => {
									onChange(e, (keyValue) =>
										this.props.updateParent(keyValue)
									)
								}}
							>
								{input.displayname}
							</Select>
						) : (
							<Input
								name={input.name}
								onChange={(e) => {
									onChange(e, (keyValue) =>
										this.props.updateParent(keyValue)
									)
								}}
								value={input.value === null ? '' : input.value}
							>
								{input.displayname}
							</Input>
						)}
					</div>
				))}
			</div>
		)
	}
}
