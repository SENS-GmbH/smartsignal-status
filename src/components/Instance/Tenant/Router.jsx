import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Wrap from '../../../shared/components/Wrapper/Wrap'
import Tenant from './Tenant'
import { Context } from '../../../shared/context'
import filter from '../../../shared/helper/Fetch API/filter'
import checkError from '../../../shared/helper/checkError'
import { getLS } from '../../../shared/helper/localStorage'
import DeviceRouter from './Devices/Router'
import NotFound from '../../../shared/components/Wrapper/NotFound'

export default class TenantRouter extends Component {
	static contextType = Context
	state = {
		loading: true,
		tenants: null,
		countTenants: null,
		notFound: false,
	}

	fetchTenants = async (input) => {
		// TODO: Paging? (auch bei Devices)
		return await fetch(
			`${this.context.instance.api}/Tenant/getFiltered?page=0&pageSize=5000`,
			{
				method: 'POST',
				headers: {
					Authorization: this.context.auth.access_token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(filter(input, 0, 2000)),
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data
				if (data.length === 0) {
					checkError(this.context.t('error.noTenants'))
				} else {
					this.setState({
						tenants: data.tenants,
					})
					return data.tenants
				}
			})
	}

	changeNotFound = () => {
		this.setState({ notFound: !this.state.notFound })
	}

	fetchOneTenant = async (id) => {
		// this.setState({ loading: true })
		return await fetch(`${this.context.instance.api}/Tenant/${id}`, {
			method: 'GET',
			headers: { Authorization: this.context.auth.access_token },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data

				this.setState({ tenants: [data] })
				return data
			})
	}

	getRecentTenants = () => {
		var tenants = getLS('recent_' + this.context.instance.shortLink)
		if (tenants === null) {
			return []
		} else return JSON.parse(tenants)
	}

	render() {
		if (this.state.notFound) {
			return <NotFound changeNotFound={this.changeNotFound} />
		}
		return (
			<Context.Provider
				value={{
					...this.context,
					recentTenants: this.getRecentTenants(),
					tenants: this.state.tenants,
					fetchTenants: this.fetchTenants,
					fetchOneTenant: this.fetchOneTenant,
					changeNotFound: this.changeNotFound,
				}}
			>
				<Routes>
					<Route path="/" element={<Wrap routeEl={Tenant} />} />
					<Route
						path=":tenantId/*"
						element={<Wrap routeEl={DeviceRouter} />}
					/>
					<Route path="*" element={<Navigate to="./" replace />} />
				</Routes>
			</Context.Provider>
		)
	}
}
