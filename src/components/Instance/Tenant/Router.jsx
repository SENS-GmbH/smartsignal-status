import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ElementWrapper from '../../../shared/components/ElementWrapper'
import DeviceListRouter from './Usecases/Router'
import Devices from './Devices/Devices'
import Tenant from './Tenant'

export default class TenantRouter extends Component {
	render() {
		return (
			<Routes>
				<Route path="/" element={<Tenant />} />
				<Route
					path="/:tenantId/*"
					element={<ElementWrapper routeElement={Devices} />}
				/>
				<Route
					path="/:tenantId/usecase/*"
					element={<ElementWrapper routeElement={DeviceListRouter} />}
				/>

				<Route path="*" element={<Navigate to="" replace />} />
			</Routes>
		)
	}
}
