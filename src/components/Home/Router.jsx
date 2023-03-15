import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { Context } from '../shared/context.js'

// import Loading from '../shared/components/Loading'
// import Login from './Login.jsx'
// import List from './List.jsx'
// import Scanner from './Scanner/Scanner.jsx'
// import Test from './test/Router.jsx'
import ElementWrapper from '../../shared/components/ElementWrapper.jsx'
import ParentApi from './ParentApi.jsx'
import Home from './Home.jsx'
import TestRouter from '../test/Router.jsx'

export default class Router extends Component {
	// static contextType = Context

	render() {
		return (
			<>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/:api/*"
							element={
								<ElementWrapper routeElement={ParentApi} />
							}
						/>
						<Route path="/test/*" element={<TestRouter />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</BrowserRouter>
				{/* <BrowserRouter>
					{!this.context.auth && (
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route
								path="*"
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
							<Route path="/scanner" element={<Scanner />} />
							Route path="/test" element={<Test />} />
							<Route path="/test/*" element={<Test />} />
							<Route
								path="*"
								element={<Navigate to="/" replace />}
							/>
						</Routes>
					)}
				</BrowserRouter> */}
			</>
		)
	}
}
