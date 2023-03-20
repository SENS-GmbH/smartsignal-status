import React, { Component } from 'react'
import Wrap from '../../shared/components/Wrapper/Wrap'
import HighOrderComponentTranslated from './Frontend2'

export default class Frontend extends Component {
	render() {
		return (
			<div>
				<Wrap routeEl={HighOrderComponentTranslated} />
			</div>
		)
	}
}
