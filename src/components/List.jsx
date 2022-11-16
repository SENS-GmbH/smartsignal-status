import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from '../shared/context'

import Loading from '../shared/components/Loading'
import Toolbar from '../shared/components/Toolbar'
import DeviceRow from './DeviceRow'

/**
 * List
 *
 * content: String
 */
export default class List extends Component {
	static contextType = Context

	state = {
		loading: true,
		tenant: { name: '' },
		tenants: [],
		devices: [],
	}

	fetchOneTenant = (tenantId) => {
		this.setState({ loading: true })
		fetch(`${this.context.apiServer}/Tenant/${tenantId}`, {
			method: 'GET',
			headers: { Authorization: this.context.auth.access_token },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data

				this.setState({ tenant: data })
				this.fetchDevices(data.id)
			})
			.catch((err) => {
				this.context.checkError({ message: err.error_description })
			})
	}

	fetchTenants = (input) => {
		this.setState({ loading: true })
		var filter = {
			filter: {
				condition: {
					'@operator': 'or',
					column: [
						{
							'@datatype': 'string',
							'@name': 'name',
							'@operator': 'ilike',
							'@relative': 'False',
							'@value': `%${input}%`,
						},
					],
				},
				column: [],
			},
		}
		fetch(`${this.context.apiServer}/Tenant/getFiltered`, {
			method: 'POST',
			headers: {
				Authorization: this.context.auth.access_token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(filter),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data
				if (data.length === 0) {
					this.context.checkError({ message: 'No Tenants found' })
					this.setState({ loading: false })
				} else {
					this.setState({ tenants: data.tenants, loading: false })
				}
			})
			.catch((err) => {
				this.context.logout()
				this.context.checkError({ message: err.error_description })
			})
	}

	fetchDevices = (tenantId, ops) => {
		this.setState({ loading: true })
		if (ops) {
			this.setState({
				tenant: this.state.tenants.find(
					(tenant) => tenant.id === tenantId
				),
			})
		}

		fetch(
			`${this.context.apiServer}/Device?tenantId=${tenantId}&pageSize=100&page=0`,
			{
				method: 'GET',
				headers: { Authorization: this.context.auth.access_token },
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data
				var filteredGW = data.devices.filter((d) => d.typeId === 1)
				var noGW = data.devices
					.filter((d) => d.typeId !== 1 && d.typeId !== 2)
					.sort((a, b) => {
						return a.serial - b.serial
					})

				var allDevices = filteredGW.concat(noGW)
				this.setState({ devices: allDevices, loading: false })
			})
			.catch((err) => {
				this.context.logout()
				this.context.checkError({ message: err.error_description })
			})
	}

	loadContent = (content) => {
		switch (content) {
			case 'tenants':
				return (
					<>
						{this.state.tenants.map((tenant, i) => (
							<div key={'listTenant' + i}>
								<NavLink
									to={this.context.client + '/tenant/' + tenant.id}
									onClick={() =>
										this.fetchDevices(tenant.id, true)
									}
								>
									<div className="w-full py-2 truncate">
										{tenant.name}
									</div>
								</NavLink>
								<hr />
							</div>
						))}
					</>
				)
			case 'devices':
				return (
					<>
						{this.state.devices.map((device, i) => (
							<div key={'listDevice' + i}>
								<DeviceRow device={device} />
							</div>
						))}
						{!this.state.loading &&
							this.state.devices.length === 0 && (
								<div className="text-center font-bold text-2xl">
									There are no devices!
								</div>
							)}
					</>
				)
			default:
				break
		}
	}

	componentDidMount = () => {
		if (this.props.content === 'devices') {
			var locationArray = window.location.href.split('/')
			var tenantId = locationArray[locationArray.indexOf('tenant') + 1]
			this.fetchOneTenant(tenantId)
			return
		}
		this.setState({ loading: false })
	}

	render() {
		return (
			<>
				<Toolbar
					reset={() => {
						this.setState({ tenant: { name: '' }, devices: [] })
					}}
					tenant={this.state.tenant}
					content={this.props.content}
					showLoading={() => {
						this.setState({ loading: true })
					}}
					fetchTenants={this.fetchTenants}
					fetchDevices={this.fetchDevices}
				/>
				<Loading loading={this.state.loading}>
					<div className="flex flex-col overflow-auto pt-4 px-4 pb-8">
						{this.loadContent(this.props.content)}
					</div>
				</Loading>
			</>
		)
	}
}
