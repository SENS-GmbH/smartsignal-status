import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Context from '#context'
import Success from './Scanner/Success'
import Wrap from '#comp/Wrapper/Wrap'
import SelectFinder from './Scanner/SelectFinder'

// DOKU:

export default class addDeviceRouter extends Component {
	static contextType = Context

	componentDidMount = () => {
		this.context.setBreadcrumb('addDevice', 'all.add.addDevice')
	}

	render() {
		return (
			<Routes>
				<Route path="/" element={<SelectFinder />} />
				<Route path=":newDeviceCode" element={<Wrap routeEl={Success} />} />
				<Route path="*" element={<Navigate to="./" replace />} />
			</Routes>
		)
	}
}
