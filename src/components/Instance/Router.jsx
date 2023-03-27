import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Context } from '../../shared/context'
import TenantRouter from './Tenant/Router'
import Login from './Login'
import Wrap from '../../shared/components/Wrapper/Wrap'
import Header from '../Structure/Header'
import Breadcrumb from '../../shared/components/Breadcrumb'
import { getLS, removeLS, saveLS } from '../../shared/helper/localStorage'
import LoadingScreen from '../../shared/components/LoadingScreen'
import instances from '../../shared/backend/instances.json'
import loginHelper, {
	getProfileHelper,
} from '../../shared/helper/Fetch API/login'
import checkError from '../../shared/helper/checkError'
import defaultValues from '../../shared/backend/defaultValues'

// TODO: Sort imports

export default class InstanceRouter extends Component {
	static contextType = Context

	state = {
		auth: null,
		loading: true,
		profile: null,
		currentBreadcrumb: {},
	}

	shortLink = this.props.params.api

	myInstance = () => {
		var myInst = instances.find((el) => el.shortLink === this.shortLink)
		if (typeof myInst === 'undefined') {
			return false
		}
		return myInst
	}

	api = this.myInstance().api
	authLink = 'auth_' + this.myInstance().shortLink

	getProfile = (auth) => {
		getProfileHelper(this.api, auth.access_token)
			.then((data) => {
				if (data.error) throw data

				this.setState({
					auth: auth,
					loading: false,
					profile: data,
				})
			})
			.catch((err) => {
				this.logout()
				console.error(err.error_description)
			})
	}

	isEditor = () => {
		var isEditor = false
		if (this.state.profile) {
			var roles = this.state.profile.roles
			defaultValues.editRoles.forEach((role) => {
				if (roles.includes(role)) {
					isEditor = true
				}
			})
		}
		return isEditor
	}

	login = (username, password) => {
		loginHelper(this.api, username, password)
			.then((data) => {
				if (data.error) throw data
				saveLS(this.authLink, data)
				this.setState({
					auth: data,
				})
				this.getProfile(data)
			})
			.catch((error) => {
				checkError(error)
			})
	}

	logout = () => {
		removeLS(this.authLink)
		if (this.context.sidebar) {
			this.context.changeSidebar()
		}
		this.setState({
			auth: null,
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

	setBreadcrumb = (key, value) => {
		if (typeof key === 'undefined' && typeof value === 'undefined') {
			this.setState({ currentBreadcrumb: {} })
		} else {
			this.setState({
				currentBreadcrumb: {
					...this.state.currentBreadcrumb,
					[key]: value,
				},
			})
		}
	}

	componentDidMount = () => {
		var myAuth = JSON.parse(getLS(this.authLink))
		if (
			myAuth &&
			myAuth.access_token &&
			this.checkValidAuth(myAuth.access_token)
		) {
			this.getProfile(myAuth)
		} else {
			this.setState({ loading: false })
		}
	}

	render() {
		if (!this.myInstance()) {
			return <Navigate to="/" replace />
		}
		if (this.state.loading) {
			return <LoadingScreen.Spinner fullScreen />
		}
		return (
			<Context.Provider
				value={{
					...this.context,
					auth: this.state.auth,
					profile: this.state.profile,
					isEditor: this.isEditor(),
					login: this.login,
					logout: this.logout,
					instance: this.myInstance(),
					setBreadcrumb: this.setBreadcrumb,
					currentBreadcrumb: this.state.currentBreadcrumb,
				}}
			>
				<div className="relative h-full">
					<div className="sticky w-full top-0 z-40">
						<Header />
						<Wrap routeEl={Breadcrumb} />
					</div>

					<div className="p-4">
						<Routes>
							{this.state.auth && (
								<>
									<Route
										path="/"
										element={<Navigate to="tenant" />}
									/>
									<Route
										path="tenant/*"
										element={<TenantRouter />}
									/>
								</>
							)}
							<Route
								path="/"
								element={<Wrap routeEl={Login} />}
							/>

							<Route
								path="*"
								element={<Navigate to="./" replace />}
							/>
						</Routes>
					</div>
				</div>
			</Context.Provider>
		)
	}
}
