import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './Home.jsx'
import TestRouter from '../test/Router.jsx'
import InstanceRouter from '../Instance/Router.jsx'
import Wrap from '#shared/components/Wrapper/Wrap.jsx'

/**
 * The root Router of the application
 *
 * @component
 * @example
 * <Router />
 */
export default class Router extends Component {
	render() {
		return (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/:api/*"
						element={<Wrap routeEl={InstanceRouter} />}
					/>
					<Route path="/test/*" element={<TestRouter />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		)
	}
}
