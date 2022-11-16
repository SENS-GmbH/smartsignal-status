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
							<Route
								path={this.context.client + '/login'}
								element={<Login />}
							/>
							<Route
								path="*"
								exact
								element={
									<Navigate
										to={this.context.client + '/login'}
										replace
									/>
								}
							/>
						</Routes>
					)}

					{this.context.auth && (
						<Routes>
							<Route
								path={this.context.client + '/'}
								exact
								element={
									<Navigate
										to={this.context.client + '/tenant'}
										replace
									/>
								}
							/>
							<Route
								path={this.context.client + '/tenant'}
								element={<List content="tenants" />}
							/>
							<Route
								path={this.context.client + '/tenant/*'}
								element={<List content="devices" />}
							/>
							<Route
								path="*"
								element={
									<Navigate
										to={this.context.client + '/'}
										replace
									/>
								}
							/>
						</Routes>
					)}
				</BrowserRouter>
			</Loading>
		)
	}
}
