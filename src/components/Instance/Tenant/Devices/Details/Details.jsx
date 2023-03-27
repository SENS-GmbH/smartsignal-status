import React, { Component } from 'react'
import LoadingScreen from '../../../../../shared/components/LoadingScreen'
import { Context } from '../../../../../shared/context'
import checkError from '../../../../../shared/helper/checkError'

export default class Details extends Component {
	static contextType = Context

	state = {
		loading: true,
		device: null,
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
		// Ich bekomme auch this.props.tenant mit! (Evaluieren, ob notwendig...)
		console.log(this.props.tenant)
		this.fetchOneDevice(this.props.params.deviceId)
			.then((device) => {
				this.setState({ device: device, loading: false })
				this.context.setBreadcrumb('device', device.attributes.installation_place)
			})
			.catch((err) => {
				checkError(err.error_description)
			})
	}

	componentWillUnmount = () => {
		this.context.setBreadcrumb('device', null)
	}

	render() {
		if (this.state.loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}
		return <div>Details</div>
	}
}
