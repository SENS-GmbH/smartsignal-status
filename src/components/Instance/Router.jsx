import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { UserContext } from '../../shared/context'
import TenantRouter from './Tenant/Router'
import Login from './Login'

export default class InstanceRouter extends Component {
	static contextType = UserContext
	render() {
		return (
			<Routes>
				<Route path="/" element={<Login />} />
				{this.context.auth && (
					<>
						<Route path="tenant/*" element={<TenantRouter />} />
					</>
				)}

				<Route path="*" element={<Navigate to="" replace />} />
			</Routes>
		)
	}
}
