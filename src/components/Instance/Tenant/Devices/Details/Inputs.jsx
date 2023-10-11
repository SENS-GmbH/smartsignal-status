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

	// TODO: BUG: Installation Place Logic für "doppelte" Installationsorte, ...

	// TODO: Vernünftiges Inputsystem, damit gespeichert werden kann!

	// TODO: Expired authentication funktioniert nicht mehr! ÜBERARBEITEN!

	render() {
		return (
			<div className="flex space-y-4 flex-col">
				{attributesSorting(this.props.inputs).map((input, i) => (
					<div key={i + '_Inputs'}>
						{this.props.appControlled.find(
							(appC) => appC.name === input.name
						)?.catalogue ? (
							<Select
								className="w-full"
								name={input.name}
								defaultValue={
									input.value === null
										? undefined
										: input.value
								}
								onChange={(e) => {
									onChange(e, (keyValue) =>
										this.props.updateParent(keyValue)
									)
								}}
								label={input.displayname}
							>
								{Object.entries(
									this.findCatalogue(
										this.props.catalogue,
										input.catalogue,
										input
									)
								).map((option, i) => (
									<option
										key={i}
										value={option[1]}
										name={option[0]}
									>
										{option[0]}
									</option>
								))}
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
