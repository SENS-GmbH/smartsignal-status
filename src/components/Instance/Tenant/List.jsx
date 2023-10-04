import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Context from '#context'

import LoadingScreen from '#comp/LoadingScreen'

/**
 * A component that renders a list of tenants.
 * @component
 * @example
 * <List />
 */
export default class List extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Object} tenant
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {Boolean} loading
	 */
	static propTypes = {
		loading: PropTypes.bool.isRequired,
	}
	static defaultProps = {
		loading: true,
	}

	myAttr = (tenant, attr) => {
		return tenant.configuration.attributes[attr]
	}

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
								<div className="w-full py-2.5 truncate flex flex-col">
									<div>{tenant.name}</div>
									<div className="italic text-sm">
										{`${this.myAttr(
											tenant,
											'market_id'
										)} - ${this.myAttr(
											tenant,
											'address'
										)} - ${this.myAttr(
											tenant,
											'zip'
										)} ${this.myAttr(
											tenant,
											'city'
										)} (${this.myAttr(
											tenant,
											'spar_region'
										)} - ${
											this.myAttr(tenant, 'market_type')
												.name
										})`}
									</div>
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
