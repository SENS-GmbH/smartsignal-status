import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'

import instances from '../../shared/backend/instances.json'
import { Context } from '../../shared/context'
import { getLS } from '../../shared/helper/localStorage'
import Instance from '../Instance/Instance'

export default class ParentApi extends Component {
	static contextType = Context

	myInstance = () => {
		var myInst = instances.find(
			(el) => el.shortLink === this.props.params.api
		)
		if (typeof myInst === 'undefined') {
			return false
		}
		return myInst
	}

	getRecentTenants = () => {
		var tenants = getLS('recent_' + this.props.params.api)
		if (tenants === null) {
			return []
		} else return JSON.parse(tenants)
	}

	render() {
		if (!this.myInstance()) {
			return <Navigate to="/" />
		}
		return (
			<Context.Provider
				value={{
					...this.context,
					instance: this.myInstance(),
					recentTenants: this.getRecentTenants(),
				}}
			>
				<Instance />
			</Context.Provider>
		)
	}
}
