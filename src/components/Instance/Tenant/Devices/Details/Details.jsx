import React, { Component } from 'react'
import LoadingScreen from '#comp/LoadingScreen.jsx'
import Context from '#context'
import checkToast from '#toast'
import { Navigate } from 'react-router-dom'
import { defaultFetch } from '#helper/Fetch API/request'
import { installationPlace } from '#helper/showData.js'
import EditDevices from './EditDevices'

// DOKU:

export default class Details extends Component {
	static contextType = Context

	state = {
		loading: true,
		device: null,
		falseTenant: false,
		editInputs: false,
	}

	AccessToken = this.context.auth.access_token

	changeEditInputs = (editInputs) => {
		this.setState({ editInputs })
	}

	// TODO: Success & Error handling with commands Uplink (toast?)

	clickDownlink = async (reset) => {
		const myBody = {
			deviceid: this.state.device.id,
			type: 'out1_' + (reset ? 'reset' : 'set'),
			parameters: [{ name: 'data', value: '' }],
		}
		const myCommand = await defaultFetch(
			`${this.context.instance.api}/Commands?tenantId=${this.state.device.tenantId}`,
			{
				method: 'PUT',
				headers: {
					Authorization: this.AccessToken,
					'Content-Type': 'application/json-patch+json',
				},
				body: JSON.stringify(myBody),
			},
			() => {
				console.log('some error with sending the command!"')
			}
		)
		console.log(myCommand)
	}

	parentLoadDevice = async () => {
		const oneDevice = await defaultFetch(
			`${this.context.instance.api}/Device/${this.props.params.deviceId}`,
			{
				method: 'GET',
				headers: { Authorization: this.AccessToken },
			},
			() => checkToast(this.context.t, 13002)
		)

		this.context.setBreadcrumb(
			'device',
			installationPlace(oneDevice.attributes)
		)

		this.setState({ device: oneDevice })

		return oneDevice
	}

	componentDidMount = async () => {
		const oneDevice = await this.parentLoadDevice()

		if (Number(this.props.tenant.id) !== oneDevice.tenantId) {
			checkToast(this.context.t, 13003)
			this.setState({ falseTenant: true })
		}

		this.setState({
			loading: false,
		})
	}

	componentWillUnmount = () => {
		this.context.setBreadcrumb('device', null)
	}

	render() {
		const { loading, falseTenant, editInputs, device } = this.state

		if (loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}

		if (falseTenant) {
			return <Navigate to=".." replace />
		}

		return (
			<EditDevices
				title={this.context.t('bread.details')}
				device={device}
				editInputs={editInputs}
				changeEditInputs={this.changeEditInputs}
				clickDownlink={this.clickDownlink}
				parentLoadDevice={this.parentLoadDevice}
				newTenantId={this.props.params.tenantId}
			/>
		)
	}
}
