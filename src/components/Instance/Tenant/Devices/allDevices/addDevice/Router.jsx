import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Context } from '../../../../../../shared/context'
import Scanner from './Scanner/Scanner'
import Success from './Scanner/Success'
import Wrap from '../../../../../../shared/components/Wrapper/Wrap'

// DOKU:

export default class addDeviceRouter extends Component {
	static contextType = Context

	componentDidMount = () => {
		this.context.setBreadcrumb('addDevice', 'all.add.addDevice')
	}

	render() {
		return (
			<Routes>
				<Route path="/" element={<Scanner />} />
				<Route path=":newDeviceCode" element={<Wrap routeEl={Success} />} />
				<Route path="*" element={<Navigate to="./" replace />} />
			</Routes>
		)
	}
}
