import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Context } from '../../../../shared/context'

import { findTenant } from '../../../../shared/helper/find'
import { saveLS } from '../../../../shared/helper/localStorage'

import LoadingScreen from '../../../../shared/components/LoadingScreen'
import Wrap from '../../../../shared/components/Wrapper/Wrap'
import addDeviceRouter from './allDevices/addDevice/Router'
import Details from './Details/Details'
import Devices from './allDevices/Devices'

/**
 * The Router for displaying devices for a tenant.
 *
 * @component
 * @example
 * <DeviceRouter />
 */
export default class DeviceRouter extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Array<Object>} recentTenants
	 * @param {number} id
	 * @param {string} name
	 * @property {Object} instance
	 * @property {Function} setBreadcrumb
	 * @param {string} - key
	 * @param {string} - value (name)
	 * @property {boolean} - isEditor
	 */
	static contextType = Context

	state = {
		loading: true,
		tenant: null,
	}

	/**
	 * @typedef {Object} ParamsShape
	 * @property {string} tenantId - The tenantId parameter of the url.
	 * @property {...*} [otherProps] - Additional properties that may be present in the params.
	 * @typedef {Object} PropTypes
	 * @property {ParamsShape} params
	 * @property {Object} locations
	 * @property {ReactNode} routeEl
	 */
	static propTypes = {
		params: PropTypes.shape({
			tenantId: PropTypes.string.isRequired,
		}),
		locations: PropTypes.object,
		routeEl: PropTypes.func.isRequired,
	}
	static defaultProps = {
		params: { tenantId: '' },
	}

	/**
	 *
	 * Adds a new tenant to the list of recent tenants, stored in local storage. Limits the list to a maximum of 5 tenants.
	 * @param {number} id - The id of the tenant.
	 * @param {string} name - The name of the tenant.
	 */
	recentToLS = (id, name) => {
		var arr = this.context.recentTenants
		var newObj = { id, name }

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

		findTenant(this.context.t, id, this.context).then((tenant) => {
			if (tenant) {
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
						path="/addDevice/*"
						element={<Wrap routeEl={addDeviceRouter} />}
					/>
				)}
				<Route path="*" element={<Navigate to="./" replace />} />
			</Routes>
		)
	}
}
