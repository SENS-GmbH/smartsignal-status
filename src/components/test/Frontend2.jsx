import React, { Component } from 'react'

export default class HighOrderComponent extends Component {
	render() {
		const { t } = this.props

		return <h1>{t('welcome.title', { framework: 'React' })}</h1>
	}
}
