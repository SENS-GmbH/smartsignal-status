import React, { Component } from 'react'
import { Context } from '../shared/context'

import Loading from '../shared/components/Loading'
import Toolbar from '../shared/components/Toolbar'

/**
 * Devices
 */
export default class Devices extends Component {
	static contextType = Context

	state = {
		loading: true,
		tenantId: null,
		devices: [],
	}

	componentDidMount = () => {
		var locationArray = window.location.href.split('/')
		var tenantId = locationArray[locationArray.indexOf('tenant') + 1]
		this.setState({ tenantId: tenantId })
		this.fetchDevices(tenantId)
	}

	render() {
		return (
			<>
				<Toolbar
					devices
					showLoading={() => {
						this.setState({ loading: true })
					}}
					fetch={this.fetchDevices}
				/>
				<div className="flex flex-col overflow-auto pt-4 px-4 pb-8">
					<Loading loading={this.state.loading}></Loading>
					{!this.state.loading && this.state.devices.length === 0 && (
						<div className="text-center font-bold text-2xl">
							There are no devices!
						</div>
					)}
				</div>
			</>
		)
	}
}
