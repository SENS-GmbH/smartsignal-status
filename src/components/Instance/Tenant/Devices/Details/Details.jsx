import React, { Component } from 'react'
import LoadingScreen from '#comp/LoadingScreen.jsx'
import Context from '#context'
import checkToast from '#toast'
import { Navigate } from 'react-router-dom'
import Inputs from './Inputs'
import { Button } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faEdit,
	faArrowRightArrowLeft,
	faSave,
	faCancel,
} from '@fortawesome/pro-light-svg-icons'
import Listed from './Listed'
import ConnectionBars from '#comp/ConnectionBars.jsx'
import { defaultFetch } from '#helper/Fetch API/request'

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

	// TODO: Besserer Name für diese Abfrage!
	saveInputToApi = async () => {
		function convertArrayToObject(jsonArray) {
			const result = {}

			jsonArray.forEach((item) => {
				for (const key in item) {
					if (item.hasOwnProperty(key)) {
						result[key] = item[key] === '' ? null : item[key]
					}
				}
			})

			return result
		}

		const allInputs = convertArrayToObject(
			this.state.appControlled.map((input) => {
				return { [input.name]: this.state.inputs[input.displayname] }
			})
		)
		if (
			allInputs.installation_place === null ||
			allInputs.installation_place2 === null
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
		this.setState({ inputs: childState })
	}

	initLoad = async () => {
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

		let appControlled = oneDeviceType.attributes.filter((attr) => {
			return attr.category === 'app-controlled'
		})
		appControlled.map(
			(type) => (type.value = oneDevice.attributes[type.name])
		)

		console.log(appControlled)

		this.setState({ appControlled, device: oneDevice })

		this.context.setBreadcrumb(
			'device',
			oneDevice.attributes.installation_place
		)

		if (this.props.tenant.id !== oneDevice.tenantId) {
			checkToast(this.context.t, 13003)
			this.setState({ falseTenant: true })
		}

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
		this.setState({ loading: false, catalogue })
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
			<div>
				<h2 className="text-center text-xl md:text-3xl mb-2">
					Details
				</h2>
				<div className="flex justify-between mx-2">
					<div className="flex font-bold flex-col">
						<div>{device.attributes.installation_place}</div>
						<div>{device.serial}</div>
					</div>
					{this.context.isEditor && (
						<div className="flex space-x-2">
							{this.state.editInputs ? (
								<>
									<Button
										onClick={this.saveInputToApi}
										className="border-white border"
									>
										<FontAwesomeIcon
											size="xl"
											icon={faSave}
										/>
									</Button>
									<Button
										onClick={() =>
											this.setState({
												editInputs: !editInputs,
											})
										}
										className="border-white border"
									>
										<FontAwesomeIcon
											size="xl"
											icon={faCancel}
										/>
									</Button>
								</>
							) : (
								<>
									<Button
										onClick={() => console.log('move')}
										className="border-white border"
									>
										<FontAwesomeIcon
											size="xl"
											icon={faArrowRightArrowLeft}
										/>
									</Button>
									<Button
										onClick={() =>
											this.setState({
												editInputs: !editInputs,
											})
										}
										className="border-white border"
									>
										<FontAwesomeIcon
											size="xl"
											icon={faEdit}
										/>
									</Button>
								</>
							)}
						</div>
					)}
				</div>
				<div className="mt-4">
					<ConnectionBars attr={this.state.device.attributes} />
				</div>
				<div className="mx-2">
					{this.state.editInputs ? (
						<Inputs
							catalogue={this.state.catalogue}
							appControlled={appControlled}
							updateParent={this.updateInputs}
						/>
					) : (
						<Listed appControlled={appControlled} />
					)}
				</div>
			</div>
		)
	}
}
