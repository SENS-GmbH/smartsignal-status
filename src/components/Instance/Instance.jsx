import React, { Component } from 'react'

import { Context } from '../../shared/context'

import Header from '../Structure/Header'
import InstanceRouter from './Router'

import {
	loginHelper,
	getProfileHelper,
} from '../../shared/helper/Fetch API/login'
import { getLS, removeLS, saveLS } from '../../shared/helper/localStorage'
import checkError from '../../shared/helper/checkError'
import { LoadingScreen } from '../../shared/components/LoadingScreen.jsx'
import BreadcrumbContainer from '../../shared/components/Breadcrumbs/BreadcrumbContainer'
import filter from '../../shared/helper/Fetch API/filter'
import NotFound from '../../shared/components/Wrapper/NotFound'

export default class Instance extends Component {
	static contextType = Context
	state = {
		auth: null,
		profile: null,
		loggedOut: false,
		loading: true,
		tenants: null,
		countTenants: null,
		tenantId: null,
		notFound: false,
	}

	authLink = 'auth_' + this.context.instance.shortLink

	login = (username, password) => {
		loginHelper(this.context.instance.api, username, password)
			.then((data) => {
				if (data.error) throw data
				saveLS(this.authLink, data)
				this.setState({
					auth: data,
					loggedOut: false,
				})
				this.getProfile(data)
			})
			.catch((error) => {
				checkError(error)
			})
	}

	logout = (changeSidebar) => {
		removeLS(this.authLink)
		if (changeSidebar) {
			changeSidebar()
		}
		this.setState({
			auth: null,
			loggedOut: true,
			loading: false,
		})
	}

	checkValidAuth = (auth) => {
		var nowUnix = Math.round(new Date().getTime() / 1000)
		if (!auth || nowUnix > auth.expiration_time) {
			return false
		}
		return true
	}

	getProfile = (auth) => {
		getProfileHelper(this.context.instance.api, auth.access_token)
			.then((data) => {
				if (data.error) throw data

				this.setState({
					profile: data,
					loading: false,
					auth: auth,
				})
			})
			.catch((err) => {
				this.logout()
				console.error(err.error_description)
				// checkError(err.error_description)
			})
	}

	setTenantId = (id) => {
		this.setState({ tenantId: id })
	}

	componentDidMount = () => {
		var myAuth = JSON.parse(getLS(this.authLink))
		if (myAuth && myAuth.access_token) {
			this.getProfile(myAuth)
		} else {
			this.setState({ loading: false })
		}
	}

	fetchTenants = async (input) => {
		// TODO: Paging?
		return await fetch(
			`${this.context.instance.api}/Tenant/getFiltered?page=0&pageSize=5000`,
			{
				method: 'POST',
				headers: {
					Authorization: this.state.auth.access_token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(filter(input, 0, 2000)),
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data
				if (data.length === 0) {
					checkError(this.context.t('error.no_tenants'))
				} else {
					this.setState({
						tenants: data.tenants,
						getCount: data.totalCount,
					})
					return data.tenants
				}
			})
	}

	changeNotFound = () => {
		this.setState({ notFound: !this.state.notFound })
	}

	fetchOneTenant = async (id) => {
		// this.setState({ loading: true })
		return await fetch(`${this.context.instance.api}/Tenant/${id}`, {
			method: 'GET',
			headers: { Authorization: this.state.auth.access_token },
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data

				this.setState({ tenants: [data] })
				return data
			})
	}

	render() {
		if (this.state.loading) {
			return <LoadingScreen.Spinner fullScreen />
		}
		if (this.state.notFound) {
			return <NotFound changeNotFound={this.changeNotFound} />
		}
		return (
			<Context.Provider
				value={{
					...this.context,
					auth: this.state.auth,
					profile: this.state.profile,
					login: this.login.bind(this),
					logout: () => {
						this.logout(this.context.changeSidebar)
					},
					tenants: this.state.tenants,
					fetchTenants: this.fetchTenants,
					tenantId: this.state.tenantId,
					setTenantId: (id) => this.setState({ tenantId: id }),
					fetchOneTenant: this.fetchOneTenant,
					changeNotFound: this.changeNotFound,
				}}
			>
				<div className="relative h-full">
					<div className="sticky w-full top-0 z-40">
						<Header />
						<BreadcrumbContainer />
					</div>
					<div className="p-4">
						<InstanceRouter />
					</div>
				</div>
			</Context.Provider>
		)
	}
}
