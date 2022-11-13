import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Context } from '../shared/context.js'

import Loading from '../shared/components/Loading'
import Login from './Login.jsx'
import List from './List.jsx'

export default class Router extends Component {
	static contextType = Context

	render() {
		return (
			<Loading loading={this.context.firstLoading}>
				<BrowserRouter>
					{!this.context.auth && (
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route
								path="*"
								exact
								element={<Navigate to="/login" replace />}
							/>
						</Routes>
					)}

					{this.context.auth && (
						<Routes>
							<Route
								path="/"
								exact
								element={<Navigate to="/tenant" replace />}
							/>
							<Route
								path="/tenant"
								element={<List content="tenants" />}
							/>
							<Route
								path="/tenant/*"
								element={<List content="devices" />}
							/>
							<Route
								path="*"
								element={<Navigate to="/" replace />}
							/>
						</Routes>
					)}
				</BrowserRouter>
			</Loading>
		)
	}
}
