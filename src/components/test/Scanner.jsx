import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'

export default class Scanner extends Component {
	state = {
		code: null,
	}

	render() {
		if (true) {
		// if (this.state.code) {
			return <Navigate to="/" />
		}
		return <div>Scanner</div>
	}
}
