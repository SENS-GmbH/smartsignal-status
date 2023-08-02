import React, { Component } from 'react'

export default class Listed extends Component {
	componentDidMount() { console.log(this.props.appControlled); }
	render() {
		return <div>Listed</div>
	}
}
