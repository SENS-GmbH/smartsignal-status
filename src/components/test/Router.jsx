import React, { Component } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Default from './Default.jsx'

export default class TestRouter extends Component {
	// static contextType = Context

	render() {
		return (
			<>
				<Routes>
					<Route
						path="/"
						exact
						element={<Navigate to="/test/default" replace />}
					/>
					<Route path="/default" element={<Default />} />
					<Route path="*" element={<Navigate to="/test" replace />} />
				</Routes>
			</>
		)
	}
}
