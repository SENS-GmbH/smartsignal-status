import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navigate, NavLink } from 'react-router-dom'

import Context from '#context'

import checkToast from '#helper/toastHandler/checkToast'

import defaultValues from '#shared/backend/defaultValues.json'

import { faClockFour } from '@fortawesome/pro-light-svg-icons'

import List from './List'
import Input from '#comp/Custom/Input'
import ScrollFooter from '#comp/Custom/Scroll/ScrollFooter'
import ScrollButton from '#comp/Custom/Scroll/ScrollButton'

/**
 * The component to see, where the user can search for a specific tenant and sees a list of those tenants.
 *
 * @component
 * @example
 * <Tenant onClick={(e) => clickHandler(e)} />
 */
export default class Tenant extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Function} fetchTenants
	 * @param {string} - name of the tenant
	 * @property {Object} instance
	 * @property {Function} t
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {Function} onClick
	 */
	static propTypes = {
		onClick: PropTypes.func,
	}
	static defaultProps = {
		onClick: null,
	}

	state = {
		loading: false,
	}

	t = this.context.t

	delayFetchTenants
	delayEnterChars

	tenantSearch = defaultValues.tenantSearch

	/**
	 * Handles input delay when searching for tenants.
	 * @param {Object} e - The input event.
	 * @param {string} e.target.value - The input value.
	 */
	delayInput = (e) => {
		clearTimeout(this.delayEnterChars)
		clearTimeout(this.delayFetchTenants)

		const value = e.target.value

		if (value.length < this.tenantSearch.minLength) {
			this.delayEnterChars = setTimeout(() => {
				checkToast(this.t, 12002, null, {
					minChars: this.tenantSearch.minLength,
				})
			}, this.tenantSearch.timeout)
			return
		}

		this.setState({ loading: true })

		this.delayFetchTenants = setTimeout(() => {
			this.context
				.fetchTenants(value)
				.then(() => this.setState({ loading: false }))
				.catch((err) => {
					this.setState({ loading: false })
					checkToast(this.t, 12003, err)
				})
		}, this.tenantSearch.timeout)
	}

	componentDidMount = () => {
		if (
			this.context.auth.tenant_id.length <
			defaultValues.autoloadTenantsBelow
		) {
			this.setState({ loading: true })
			this.context
				.fetchTenants('')
				.then(() => {
					this.setState({ loading: false })
				})
				.catch((err) => {
					this.setState({ loading: false })
					checkToast(this.t, 12004, err)
				})
		}
	}

	componentWillUnmount = () => {
		if (!this.props.onClick) {
			this.context.setBreadcrumb('tenant', null)
		}
	}

	render() {
		const { auth, t, recentTenants } = this.context
		const { onClick } = this.props
		const { loading } = this.state

		if (auth.tenant_id.length === 1) {
			return <Navigate to={'' + auth.tenant_id[0]} replace />
		}

		return (
			<div>
				<div>
					<Input name="searchTenant" onChange={this.delayInput}>
						{t('tenant.placeholder.input')}
					</Input>
					{recentTenants.length > 0 && (
						<ScrollFooter icon={faClockFour} bottomLine>
							{recentTenants.map((recent, i) => (
								<ScrollButton
									key={recent.id + '_recentTenants'}
									truncate
								>
									{onClick ? (
										<span
											data-tenantid={recent.id}
											onClick={this.props.onClick.bind(
												this
											)}
										>
											{recent.name}
										</span>
									) : (
										<NavLink to={recent.id}>
											{recent.name}
										</NavLink>
									)}
								</ScrollButton>
							))}
						</ScrollFooter>
					)}
				</div>
				<List onClick={onClick} loading={loading} />
			</div>
		)
	}
}
