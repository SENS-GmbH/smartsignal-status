import React, { Component } from 'react'
import checkError from '../../../shared/helper/checkError'
import List from './List'
import { Context } from '../../../shared/context'
import Input from '../../../shared/components/Custom/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockFour } from '@fortawesome/free-solid-svg-icons'
import { Navigate, NavLink } from 'react-router-dom'
import defaultValues from '../../../shared/backend/defaultValues.json'

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
				checkError('Enter at least 3 characters')
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
					checkError(err)
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
					checkError(err)
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
						<>
							<div className="flex py-3 space-x-4 overflow-x-auto">
								<div className="text-gray-400 text-2xl">
									<FontAwesomeIcon icon={faClockFour} />
								</div>
								<div className="flex space-x-3">
									{this.context.recentTenants.map(
										(recent, i) => (
											<div
												key={i + '_recentTenants'}
												className="max-w-[128px] truncate bg-white dark:bg-gray-700 rounded-md p-1 px-2 border border-gray-500 dark:border-0 text-center"
											>
												<NavLink to={recent.id}>
													{recent.name}
												</NavLink>
											</div>
										)
									)}
								</div>
							</div>
							<hr />
						</>
					)}
				</div>
				<List loading={this.state.loading} />
			</div>
		)
	}
}
