import React, { Component } from 'react'
import LoadingScreen from '../../../../shared/components/LoadingScreen'
import { Context } from '../../../../shared/context'
import checkError from '../../../../shared/helper/checkError'
import { saveLS } from '../../../../shared/helper/localStorage'

export default class Devices extends Component {
	static contextType = Context

	state = {
		loading: true,
		devices: [],
	}

	fetchDevices = (tenantId) => {
		fetch(
			`${this.context.instance.api}/Device?tenantId=${tenantId}&pageSize=100&page=0`,
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
				checkError(err.error_description)
			})
	}

	recentToLS = (id, name) => {
		var arr = this.context.recentTenants
		var newObj = {
			id: id,
			name: name,
		}

		var index = arr.findIndex((item) => item.id === id)
		if (index !== -1) {
			arr.splice(index, 1)
			arr.unshift(newObj)
		} else if (arr === null || arr.length === 0) {
			arr = [newObj]
		} else if (arr.length < 5) {
			arr.unshift(newObj)
		} else {
			arr.pop()
			arr.unshift(newObj)
		}

		saveLS('recent_' + this.context.instance.shortLink, arr)
	}

	componentDidMount = () => {
		var name = ''
		var id = this.props.params.tenantId

		if (this.context.tenants === null) {
			this.context
				.fetchOneTenant(id)
				.then((data) => {
					this.recentToLS(id, data.name)
				})
				.catch((err) => {
					this.context.changeNotFound()
					console.log(err.error_description)
				})
		} else if (
			this.context.tenants.findIndex((i) => i.id.toString() === id) !== -1
		) {
			name = this.context.tenants.find(
				(tenant) => tenant.id.toString() === id
			).name
			this.recentToLS(id, name)
		} else {
			name = this.context.recentTenants.find(
				(tenant) => tenant.id.toString() === id
			).name
			this.recentToLS(id, name)
		}
		this.context.setTenantId(id)

		this.fetchDevices(id)
	}
	render() {
		if (this.state.loading) {
			return <LoadingScreen.Spinner fullScreen />
		}
		return <div>Liste mit allen Devices</div>
	}
}
