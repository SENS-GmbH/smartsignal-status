import React, { Component } from 'react'
import Input from '#comp/Custom/Input'

import Context from '#context'
import { defaultFetch } from '#helper/Fetch API/request'

// DOKU:

export default class Success extends Component {
	static contextType = Context

filter

	componentDidMount() {
		defaultFetch(`${this.context.instance.api}/Device/`,)
	}

	render() {
		return (
			<>
				<h2 className="text-center text-xl md:text-3xl mb-2">
					{this.context.t('all.add.addDevice')}
				</h2>
				<div>{this.props.params.newDeviceCode}</div>
				<Input name="test1" onChange={() => {}}>
					Test
				</Input>
			</>
		)
	}
}
