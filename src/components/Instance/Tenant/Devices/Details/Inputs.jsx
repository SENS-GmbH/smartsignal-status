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

	findCatalogue = (cata, name) => {
		let myReturn = {}
		cata.find((c) => c.name === name).values.forEach((t) => {
			myReturn[t.name] = t.code
		})
		return myReturn
	}

	// FUTURE: Search Tenant to find if installation_place & installation_number combination is available.

	installationPlaceCheck = () => {
		const currentInstallationPlace = this.props.inputs.find(
			(input) => input.name === 'installation_place'
		).value

		const allCatalogEntries = Object.values(
			this.findCatalogue(
				this.props.catalogue,
				'spar_installation_place_check'
			)
		).map((entry) => entry.split('|').map((item) => item.trim()))

		const installationPlaceData = allCatalogEntries.reduce(
			(result, entry) => {
				const [name, value] = entry
				const existingEntry = result.find((item) => item.name === name)

				if (existingEntry) {
					existingEntry.values.push(value)
				} else {
					result.push({ name, values: [value] })
				}

				return result
			},
			[]
		)

		const selectedInstallationPlaceData = installationPlaceData.find(
			(entry) => entry.name === currentInstallationPlace
		)

		if (selectedInstallationPlaceData) {
			return selectedInstallationPlaceData.values
		} else {
			// TODO: Error "Wenn kein spar_installation_place_check-Match gefunden wurde."
			return []
		}
	}

	// TODO: "Object entries unnötig. Elegantere Lösung finden!"

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
								{input.name === 'installation_number'
									? this.installationPlaceCheck().map(
											(option, i) => (
												<option
													key={i}
													value={option[1]}
													name={option[0]}
												>
													{option[0]}
												</option>
											)
									  )
									: Object.entries(
											this.findCatalogue(
												this.props.catalogue,
												input.catalogue
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
