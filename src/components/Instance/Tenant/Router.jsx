import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Context from '#context'

import { getLS } from '#helper/localStorage'
import filter from '#helper/Fetch API/filter'
import checkToast from '#helper/toastHandler/checkToast'

import Wrap from '#comp/Wrapper/Wrap'
import Tenant from './Tenant'
import DeviceRouter from './Devices/Router'
import NotFound from '#comp/Wrapper/NotFound'

/**
 * The component to see, where the user can search for a specific tenant and sees a list of those tenants.
 *
 * @component
 * @example
 * <TenantRouter />
 */
export default class TenantRouter extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Object} instance
	 * @property {Object} auth
	 */
	static contextType = Context

	state = {
		loading: true,
		tenants: null,
		countTenants: null,
		notFound: false,
	}

	/**
	 * Retrieves a list of tenants based on the provided filter and sets the state of the component.
	 * @async
	 * @param {string} input - The search term to filter tenants by.
	 * @throws {Error} If the API returns an error message.
	 * @returns {Promise<Array<Object>>} An array of tenant objects that match the search term.
	 */
	fetchTenants = async (input) => {
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
					checkToast(this.context.t, 12001)
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

	/**
	 * Retrieves the tenant object for the specified ID and sets the state of the component.
	 * @async
	 * @param {number} id - The ID of the tenant to retrieve.
	 * @throws {Error} If the API returns an error message.
	 * @returns {Promise<Object>} The tenant object for the specified ID.
	 */
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

	/**
	 * Retrieves the list of recent tenants from local storage.
	 * @returns {Array<Object>} An array of tenant objects representing the recent tenants.
	 */
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
