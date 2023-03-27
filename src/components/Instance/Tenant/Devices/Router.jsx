import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoadingScreen from '../../../../shared/components/LoadingScreen'
import Wrap from '../../../../shared/components/Wrapper/Wrap'
import { Context } from '../../../../shared/context'
import { findTenant } from '../../../../shared/helper/find'
import { saveLS } from '../../../../shared/helper/localStorage'
import addDevice from './addDevice'
import Details from './Details/Details'
import Devices from './Devices'

export default class DeviceRouter extends Component {
	static contextType = Context

	state = {
		loading: true,
		tenant: null,
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

	componentDidMount = async () => {
		var id = this.props.params.tenantId

		findTenant(id, this.context).then((tenant) => {
			if (tenant !== '') {
				this.recentToLS(id, tenant.name)
				this.context.setBreadcrumb('tenant', tenant.name)
			}
			this.setState({ tenant: tenant, loading: false })
		})
	}

	render() {
		if (this.state.loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}
		return (
			<Routes>
				<Route
					path="/"
					element={
						<Wrap routeEl={Devices} tenant={this.state.tenant} />
					}
				/>
				<Route
					path="/device/:deviceId"
					element={
						<Wrap routeEl={Details} tenant={this.state.tenant} />
					}
				/>
				{/* <Route
						path="/usecase/*"
						element={<Wrap routeEl={DeviceListRouter} />}
					/> */}
				{this.context.isEditor && (
					<Route
						path="/addDevice"
						element={<Wrap routeEl={addDevice} />}
					/>
				)}
				<Route path="*" element={<Navigate to="./" replace />} />
			</Routes>
		)
	}
}
