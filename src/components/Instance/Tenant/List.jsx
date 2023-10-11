import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Context from '#context'

import LoadingScreen from '#comp/LoadingScreen'

/**
 * A component that renders a list of tenants.
 * @component
 * @example
 * <List onClick={this.props.onClock} />
 */
export default class List extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Object} tenant
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {Func} onClick
	 */
	static propTypes = {
		onClick: PropTypes.func,
	}
	static defaultProps = {
		onClick: null,
	}

	// DOKU:
	myAttr = (tenant, attr) => {
		// if (tenant.configuration.attributes[attr]) {
		return tenant.configuration.attributes[attr]
		// } else {
		// return ''
		// }
	}

	secondLine = (tenant) => {
		var myString = ''
		if (this.myAttr(tenant, 'market_id')) {
			myString += this.myAttr(tenant, 'market_id') + ' - '
		}
		if (this.myAttr(tenant, 'address')) {
			myString += this.myAttr(tenant, 'address') + ' - '
		}
		if (this.myAttr(tenant, 'zip')) {
			myString += this.myAttr(tenant, 'zip') + ' '
		}
		if (this.myAttr(tenant, 'city')) {
			myString += this.myAttr(tenant, 'city') + ' '
		}
		if (this.myAttr(tenant, 'spar_region')) {
			myString += '(' + this.myAttr(tenant, 'spar_region') + ' - '
		} else if (this.myAttr(tenant, 'market_type')) {
			myString += '('
		}
		if (this.myAttr(tenant, 'market_type')) {
			myString += this.myAttr(tenant, 'market_type')?.name + ')'
		} else if (this.myAttr(tenant, 'spar_region')) {
			myString += ')'
		}
		return myString
	}
	insideRow = (tenant) => {
		return (
			<>
				<div className="py-2.5 truncate flex flex-col relative">
					<span className="truncate font-bold">{tenant.name}</span>
					<p className="italic text-sm w-full break-words whitespace-pre-wrap">
						{this.secondLine(tenant)}
					</p>
				</div>
				<div className="border-b border-gray-500" />
			</>
		)
	}

	render() {
		if (this.props.loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}

		return (
			<div className="mt-1">
				{this.context.tenants?.map((tenant) => (
					<div key={tenant.id}>
						{this.props.onClick ? (
							<div
								data-tenantid={tenant.id}
								className="cursor-pointer"
								onClick={this.props.onClick.bind(this)}
							>
								{this.insideRow(tenant)}
							</div>
						) : (
							<NavLink to={tenant.id.toString()}>
								{this.insideRow(tenant)}
							</NavLink>
						)}
					</div>
				))}
			</div>
		)
	}
}
