import React, { Component } from 'react'
import checkToast from '../../../shared/helper/toastHandler/checkToast'
import List from './List'
import { Context } from '../../../shared/context'
import Input from '../../../shared/components/Custom/Input'
import { faClockFour } from '@fortawesome/pro-light-svg-icons'
import { Navigate, NavLink } from 'react-router-dom'
import defaultValues from '../../../shared/backend/defaultValues.json'
import ScrollFooter from '../../../shared/components/Custom/Scroll/ScrollFooter'
import ScrollButton from '../../../shared/components/Custom/Scroll/ScrollButton'

export default class Tenant extends Component {
	static contextType = Context

	state = {
		loading: false,
		searchTenant: '',
	}

	minLength = 3
	timeout = 1500
	delayFetchTenants
	delayEnter3Chars

	delayInput = (e) => {
		var value = e.target.value
		clearTimeout(this.delayEnter3Chars)
		clearTimeout(this.delayFetchTenants)

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
				.then(() => {
					this.setState({ loading: false })
				})
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
		if (this.context.auth.tenant_id.length === 1) {
			return <Navigate to={'' + this.context.auth.tenant_id[0]} replace />
		}
		return (
			<div>
				<div>
					<Input name="searchTenant" onChange={this.delayInput}>
						{this.context.t('tenant.placeholder.input')}
					</Input>
					{this.context.recentTenants.length > 0 && (
						<ScrollFooter icon={faClockFour} bottomLine>
							{this.context.recentTenants.map((recent, i) => (
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
