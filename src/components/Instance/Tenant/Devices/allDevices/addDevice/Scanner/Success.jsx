import React, { Component } from 'react'
import Input from '../../../../../../../shared/components/Custom/Input'

import { Context } from '../../../../../../../shared/context'

// DOKU:

export default class Success extends Component {
	static contextType = Context
	render() {
		return (
			<>
				<div>{this.props.params.newDeviceCode}</div>
				<Input name="test1" onChange={() => {}}>
					Test
				</Input>
			</>
		)
	}
}
