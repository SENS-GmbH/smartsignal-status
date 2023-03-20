import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'

export default class TestNavigate extends Component {
	componentDidMount = () => {
		console.log('test');
	}
	render() {
		return <Navigate to="" replace />
	}
}
