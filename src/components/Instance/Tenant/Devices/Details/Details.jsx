import React, { Component } from 'react'
import LoadingScreen from '#comp/LoadingScreen.jsx'
import Context from '#context'
import checkToast from '#toast'
import { Navigate } from 'react-router-dom'
import Inputs from './Inputs'

import Listed from './Listed'
import ConnectionBars from '#comp/ConnectionBars.jsx'
import { defaultFetch } from '#helper/Fetch API/request'
import DetailsHeader from './DetailsHeader'
import { installationPlace } from '#helper/showData.js'
import defaultValues from '../../../../../shared/backend/defaultValues.json'
import { Button } from 'flowbite-react'

// DOKU:

export default class Details extends Component {
	static contextType = Context

	// TODO: More beautiful and more informative
	// TODO: "Listed" should be extended

	state = {
		loading: true,
		device: null,
		catalogue: null,
		appControlled: null,
		falseTenant: false,
		editInputs: false,
		inputs: null,
	}

	AccessToken = this.context.auth.access_token

	saveInputs = async () => {
		let allInputs = {}

		const mappedAppControlled = this.state.appControlled.map((input) => {
			return {
				[input.name]: this.state.inputs.find(
					(i) => i.displayname === input.displayname
				),
			}
		})

		mappedAppControlled.forEach((item) => {
			for (const key in item) {
				if (item.hasOwnProperty(key)) {
					allInputs[key] =
						item[key].value === '' ? null : item[key].value
				}
			}
		})

		if (
			allInputs.installation_place === null ||
			(allInputs.installation_place === 'Sonstiges' &&
				allInputs.installation_place2 === null)
		) {
			checkToast(this.context.t, 15003)
			return
		}

		const updatedAttributes = await defaultFetch(
			`${this.context.instance.api}/Device/${this.state.device.id}`,
			{
				method: 'PATCH',
				headers: {
					Authorization: this.AccessToken,
					'Content-Type': 'application/json-patch+json',
				},
				body: JSON.stringify(allInputs),
			},
			() => checkToast(this.context.t, 15003)
		)

		checkToast(
			this.context.t,
			updatedAttributes.isUpdated ? 15101 : 15002,
			updatedAttributes
		)

		this.setState({ loading: true, editInputs: false })
		this.initLoad()
	}

	updateInputs = (childState) => {
		// childstate: { [name]: value }
		const entries = Object.entries(childState)
		const myState = this.state.inputs
		const allOthers = myState.filter((i) => i.name !== entries[0][0])
		const finds = myState.find((i) => i.name === entries[0][0])
		allOthers.push({
			name: finds.name,
			value: entries[0][1],
			displayname: finds.displayname,
			catalogue: finds.catalogue,
		})
		this.setState({ inputs: allOthers })
	}

	initLoad = async () => {
		const catalogue = await defaultFetch(
			`${this.context.instance.api}/Catalogue/data?tenantId=${this.props.params.tenantId}&pageSize=50000`,
			{
				method: 'GET',
				headers: {
					Authorization: this.context.auth.access_token,
				},
			},
			() => checkToast(this.context.t, 13005)
		)

		const oneDevice = await defaultFetch(
			`${this.context.instance.api}/Device/${this.props.params.deviceId}`,
			{
				method: 'GET',
				headers: { Authorization: this.AccessToken },
			},
			() => checkToast(this.context.t, 13002)
		)

		const oneDeviceType = await defaultFetch(
			`${this.context.instance.api}/DeviceType/${oneDevice.typeId}`,
			{
				method: 'GET',
				headers: { Authorization: this.AccessToken },
			},
			() => checkToast(this.context.t, 13004)
		)

		this.context.setBreadcrumb(
			'device',
			installationPlace(oneDevice.attributes)
		)

		if (Number(this.props.tenant.id) !== oneDevice.tenantId) {
			checkToast(this.context.t, 13003)
			this.setState({ falseTenant: true })
		}

		let appControlled = oneDeviceType.attributes.filter((attr) => {
			return attr.category === 'app-controlled'
		})
		appControlled.map(
			(type) => (type.value = oneDevice.attributes[type.name])
		)

		let inputs = []
		appControlled.forEach((appC) => {
			inputs.push({
				displayname: appC.displayname,
				name: appC.name,
				value: appC.value,
				catalogue: appC.catalogue,
			})
		})

		this.setState({
			appControlled: appControlled,
			device: oneDevice,
			loading: false,
			catalogue,
			inputs,
		})
	}

	changeEditInputs = () => {
		this.setState({ editInputs: !this.state.editInputs })
	}

	componentDidMount = () => {
		this.initLoad()
	}

	componentWillUnmount = () => {
		this.context.setBreadcrumb('device', null)
	}

	render() {
		const { loading, falseTenant, device, editInputs, appControlled } =
			this.state

		if (loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}

		if (falseTenant) {
			return <Navigate to=".." />
		}

		return (
			<div className="px-0 sm:px-5 md:px-10">
				<h2 className="text-center text-xl md:text-3xl mb-2">
					Details
				</h2>
				<hr />
				<DetailsHeader
					device={device}
					editInputs={editInputs}
					changeEditInputs={this.changeEditInputs}
					saveInputs={this.saveInputs}
				/>

				{device.typeId !== 1 && (
					<ConnectionBars attr={device.attributes} />
				)}

				<div className="mx-2">
					{this.state.editInputs ? (
						<Inputs
							catalogue={this.state.catalogue}
							appControlled={appControlled}
							updateParent={this.updateInputs}
							inputs={this.state.inputs}
						/>
					) : (
						<Listed
							appControlled={appControlled}
						/>
					)}
				</div>
				{defaultValues.Downlink_TypeIds.io.includes(device.typeId) && (
					<div className="flex space-x-2">
						<Button className="w-1/2" color="green">
							Ein
						</Button>
						<Button className="w-1/2" color="red">
							Aus
						</Button>
					</div>
				)}
			</div>
		)
	}
}
