import React, { Component } from 'react'
import LoadingScreen from '../../../../../shared/components/LoadingScreen'
import { Context } from '../../../../../shared/context'
import checkToast from '../../../../../shared/helper/toastHandler/checkToast'
import { Navigate } from 'react-router-dom'

// DOKU:

export default class Details extends Component {
	static contextType = Context

	state = {
		loading: true,
		device: null,
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

	componentDidMount = () => {
		this.fetchOneDevice(this.props.params.deviceId)
			.then((device) => {
				this.setState({ device: device, loading: false })
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
		if (this.state.loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}
		if (this.state.falseTenant) {
			return <Navigate to=".." />
		}
		return <div>Details</div>
	}
}
