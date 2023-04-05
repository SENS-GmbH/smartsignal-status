import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Context } from '../shared/context.js'

import Loading from '../shared/components/Loading'
import Login from './Login.jsx'
import List from './List.jsx'
// import Scanner from './Scanner/Scanner.jsx'
import Test from './Scanner/Test.jsx'

export default class Router extends Component {
	static contextType = Context

	render() {
		return (
			<Loading loading={this.context.firstLoading}>
				<BrowserRouter>
					{!this.context.auth && (
						<Routes>
							<Route path="/smartsignal" element={<Login />} />
							<Route
								path="*"
								element={<Navigate to="/smartsignal" replace />}
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
							{/* <Route path="/scanner" element={<Scanner />} /> */}
							<Route path="/test" element={<Test />} />
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
