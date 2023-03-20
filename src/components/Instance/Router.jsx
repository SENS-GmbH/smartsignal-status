import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Context } from '../../shared/context'
import TenantRouter from './Tenant/Router'
import Login from './Login'

export default class InstanceRouter extends Component {
	static contextType = Context
	render() {
		return (
			<Routes>
				{this.context.auth && (
					<>
						<Route path="/" element={<Navigate to="tenant" />} />
						<Route
							path="tenant/*"
							element={<TenantRouter />}
						/>
					</>
				)}
				<Route path="/" element={<Login />} />

				<Route path="*" element={<Navigate to="" replace />} />
			</Routes>
		)
	}
}
