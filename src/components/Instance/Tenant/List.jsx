import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import LoadingScreen from '../../../shared/components/LoadingScreen'
import { Context } from '../../../shared/context'

/**
 * List
 *
 * loading: Boolean
 * tenants: Array
 */
export default class List extends Component {
	static contextType = Context
	render() {
		if (this.props.loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}
		return (
			<div>
				<div className="mt-1">
					{this.context.tenants?.map((tenant) => (
						<div key={tenant.id}>
							<NavLink to={tenant.id.toString()}>
								<div className="w-full py-2.5 truncate">
									{tenant.name}
								</div>
							</NavLink>
							<div className="border-b border-gray-500" />
						</div>
					))}
				</div>
			</div>
		)
	}
}
