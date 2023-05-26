import React, { Component } from 'react'
import LoadingScreen from '../../../../../shared/components/LoadingScreen'
import { Context } from '../../../../../shared/context'
import checkToast from '../../../../../shared/helper/toastHandler/checkToast'
import { Navigate } from 'react-router-dom'
import Inputs from './Inputs'
import { Button } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faArrowRightArrowLeft } from '@fortawesome/pro-light-svg-icons'
import Listed from './Listed'
import ConnectionBars from '../../../../../shared/components/ConnectionBars'

// DOKU:

export default class Details extends Component {
	static contextType = Context

	// TODO: More beautiful and more informative
	// TODO: "Listed" should be extended

	state = {
		loading: true,
		device: null,
		appControlled: null,
		falseTenant: false,
	}

	fetchOneDevice = async (id) => {
		return await fetch(`${this.context.instance.api}/Device/${id}`, {
			method: 'GET',
			headers: { Authorization: this.context.auth.access_token },
		})
			.then((response) => response.json())
			.then((data) => {
				return data
			})
	}

	fetchDeviceType = async (id) => {
		return await fetch(`${this.context.instance.api}/DeviceType/${id}`, {
			method: 'GET',
			headers: { Authorization: this.context.auth.access_token },
		})
			.then((response) => response.json())
			.then((data) => {
				return data
			})
	}

	componentDidMount = () => {
		this.fetchOneDevice(this.props.params.deviceId)
			.then((device) => {
				this.setState({ device: device })
				this.fetchDeviceType(device.typeId)
					.then((type) => {
						const filtered = type.attributes.filter((attr) => {
							return attr.category === 'app-controlled'
						})
						let appControlled = {}
						filtered.forEach((filterType) => {
							// TODO: Investigate, if an Object should be passed or the current name as a String
							appControlled[filterType.displayname] =
								device.attributes[filterType.name]
						})

						this.setState({ appControlled, loading: false })
					})
					.catch((err) => {
						checkToast(this.context.t, 13004, err)
					})
				this.context.setBreadcrumb(
					'device',
					device.attributes.installation_place
				)
				if (this.props.tenant.id !== device.tenantId) {
					this.setState({ falseTenant: true })
					checkToast(this.context.t, 13003)
				}
			})
			.catch((err) => {
				checkToast(this.context.t, 13002, err)
			})
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
				<div className="flex justify-between">
					<div>{device.serial}</div>
					{this.context.isEditor && (
						<div className="flex space-x-2">
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
								<FontAwesomeIcon size="xl" icon={faEdit} />
							</Button>
						</div>
					)}
				</div>
				<div className="mt-4">
					<ConnectionBars attr={this.state.device.attributes} />
				</div>
				<div>
					{this.state.editInputs ? (
						<Inputs appControlled={appControlled} />
					) : (
						<Listed appControlled={appControlled} />
					)}
				</div>
			</div>
		)
	}
}
