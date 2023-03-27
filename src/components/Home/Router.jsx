import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Home from './Home.jsx'
import TestRouter from '../test/Router.jsx'
import { Context } from '../../shared/context.js'
import InstanceRouter from '../Instance/Router.jsx'
import Wrap from '../../shared/components/Wrapper/Wrap.jsx'

export default class Router extends Component {
	static contextType = Context

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
