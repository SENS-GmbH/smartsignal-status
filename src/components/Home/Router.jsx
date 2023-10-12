import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// import Home from './Home.jsx'
import InstanceRouter from '../Instance/Router.jsx'
import Wrap from '#shared/components/Wrapper/Wrap.jsx'
import instances from '../../shared/backend/instances.json'

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
					{/* <Route path="/" element={<Home />} /> */}
					<Route
						path="/:api/*"
						element={<Wrap routeEl={InstanceRouter} />}
					/>
					<Route
						path="*"
						element={
							<Navigate
								to={'/' + instances[0].shortLink}
								replace
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
		)
	}
}
