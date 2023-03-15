import React, { Component } from 'react'

export default class Usecase extends Component {
	componentDidMount = () => {
		console.log(this.props)
		// Hier muss man sich überlegen, wie man die Baumstruktur von der IOTA gut darstellt in "/".
	}
	render() {
		return <div>Bestimmter Usecase</div>
	}
}
