import React, { Component } from 'react'

export default class LoginTest extends Component {
	componentDidMount = () => {
		console.log(this.props)
	}
	render() {
		return <div>LoginTest</div>
	}
}
