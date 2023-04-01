import React, { Component } from 'react'
import { Navigate, NavLink } from 'react-router-dom'

import { Context } from '../../../shared/context'

import checkToast from '../../../shared/helper/toastHandler/checkToast'

import defaultValues from '../../../shared/backend/defaultValues.json'

import { faClockFour } from '@fortawesome/pro-light-svg-icons'

import List from './List'
import Input from '../../../shared/components/Custom/Input'
import ScrollFooter from '../../../shared/components/Custom/Scroll/ScrollFooter'
import ScrollButton from '../../../shared/components/Custom/Scroll/ScrollButton'

/**
 * The component to see, where the user can search for a specific tenant and sees a list of those tenants.
 *
 * @component
 * @example
 * <Tenant />
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

	state = {
		loading: false,
		searchTenant: '',
	}

	// TODO: In Defaultvalues exportieren (Object)
	minLength = 3
	timeout = 1500

	delayFetchTenants
	delayEnter3Chars

	/**
	 * Handles input delay when searching for tenants.
	 * @param {Object} e - The input event.
	 * @param {string} e.target.value - The input value.
	 */
	delayInput = (e) => {
		clearTimeout(this.delayEnter3Chars)
		clearTimeout(this.delayFetchTenants)

		const value = e.target.value

		if (value.length < this.minLength) {
			this.delayEnter3Chars = setTimeout(() => {
				checkToast(12002)
			}, this.timeout)
			return
		}

		this.setState({ loading: true })

		this.delayFetchTenants = setTimeout(() => {
			this.context
				.fetchTenants(value)
				.then(() => this.setState({ loading: false }))
				.catch((err) => {
					this.setState({ loading: false })
					checkToast(12003, err)
				})
		}, this.timeout)
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
					checkToast(12004, err)
				})
		}
	}

	componentWillUnmount = () => {
		this.context.setBreadcrumb('tenant', null)
	}

	render() {
		const { auth, t, recentTenants } = this.context

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
									<NavLink to={recent.id}>
										{recent.name}
									</NavLink>
								</ScrollButton>
							))}
						</ScrollFooter>
					)}
				</div>
				<List loading={this.state.loading} />
			</div>
		)
	}
}
