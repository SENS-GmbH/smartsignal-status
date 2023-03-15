import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ElementWrapper from '../../../../shared/components/ElementWrapper'
import Usecase from './Usecase'

export default class UsecaseRouter extends Component {
	componentDidMount = () => {
		console.log(this.props)
		// Hier muss man sich überlegen, wie man die Baumstruktur von der IOTA gut darstellt in "/".
	}
	render() {
		return (
			<Routes>
				<Route path="/" element={<>All Usecases Übersicht</>} />

				<Route
					path="/:usecaseId/*"
					element={<ElementWrapper routeElement={Usecase} />}
				/>

				<Route path="*" element={<Navigate to="" replace />} />
			</Routes>
		)
	}
}
