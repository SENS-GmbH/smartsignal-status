import React, { Component } from 'react'
import { Context } from '../../../../../shared/context'

// DOKU:

export default class addDevice extends Component {
	static contextType = Context

	componentDidMount = () => {
		this.context.setBreadcrumb('addDevice', 'all.add.addDevice')
	}

	render() {
		return <div>addDevice</div>
	}
}
