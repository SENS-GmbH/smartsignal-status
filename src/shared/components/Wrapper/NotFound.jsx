import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'

export default class NotFound extends Component {
	componentDidMount = () => {
		this.props.changeNotFound()
	}
	render() {
		return <Navigate to="" replace />
	}
}
