import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Wrap from '../../../shared/components/Wrapper/Wrap'
import DeviceListRouter from './Usecases/Router'
import Devices from './Devices/Devices'
import Tenant from './Tenant'

export default class TenantRouter extends Component {
	render() {
		return (
			<Routes>
				<Route path="/" element={<Wrap routeEl={Tenant} />} />
				<Route
					path="/:tenantId"
					element={<Wrap routeEl={Devices} />}
				/>
				<Route
					path="/:tenantId/usecase/*"
					element={<Wrap routeEl={DeviceListRouter} />}
				/>

				<Route path="*" element={<Navigate to="" replace />} />
			</Routes>
		)
	}
}
