import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'

import instances from '../../shared/backend/instances.json'
import { InstanceContext } from '../../shared/context'
import { getLS } from '../../shared/helper/localStorage'
import Instance from '../Instance/Instance'

export default class ParentApi extends Component {
	shortLink = this.props.params.api

	myInstance = () => {
		var myInst = instances.find((el) => el.shortLink === this.shortLink)
		if (typeof myInst === 'undefined') {
			return false
		}
		return myInst
	}

	render() {
		if (!this.myInstance()) {
			return <Navigate to="/" />
		}
		return (
			<InstanceContext.Provider
				value={{
					instance: this.myInstance(),
					localStorageAuth: getLS('auth_' + this.shortLink),
				}}
			>
				<Instance />
			</InstanceContext.Provider>
		)
	}
}
