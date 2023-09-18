import React, { Component } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Success from './Success.jsx'
// import Test from './Test.jsx'

export default class TestRouter extends Component {
	// <Route path="/default" element={<Test />} />
	render() {
		return (
			<>
				<Routes>
					<Route
						path="/"
						exact
						element={<Navigate to="./default" replace />}
					/>
					<Route path="/success/:addDevice" element={<Success />} />
					<Route path="*" element={<Navigate to="./" replace />} />
				</Routes>
			</>
		)
	}
}
