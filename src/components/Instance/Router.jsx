import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Context } from '../../shared/context'

import { getLS, removeLS, saveLS } from '../../shared/helper/localStorage'
import loginHelper, {
	getProfileHelper,
} from '../../shared/helper/Fetch API/login'
import checkToast from '../../shared/helper/toastHandler/checkToast'

import instances from '../../shared/backend/instances'
import defaultValues from '../../shared/backend/defaultValues'

import TenantRouter from './Tenant/Router'
import Login from './Login'
import Wrap from '../../shared/components/Wrapper/Wrap'
import Header from '../Structure/Header'
import Breadcrumb from '../../shared/components/Breadcrumb'
import LoadingScreen from '../../shared/components/LoadingScreen'

/**
 * InstanceRouter component that handles authentication and user profile for a specific instance.
 *
 * @component
 * @example
 * <Wrap routeEl={InstanceRouter} />
 */
export default class InstanceRouter extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Object} changeSidebar - A function to toggle sidebar on and off.
	 * @property {boolean} sidebar - A boolean indicating whether the sidebar is currently visible or not.
	 */
	static contextType = Context

	state = {
		auth: null,
		loading: true,
		profile: null,
		currentBreadcrumb: {},
	}

	/**
	 * @typedef {Object} ParamsShape
	 * @property {string} api - The api parameter of the url.
	 * @property {...*} [otherProps] - Additional properties that may be present in the params.
	 * @typedef {Object} PropTypes
	 * @property {ParamsShape} params
	 * @property {Object} locations
	 * @property {ReactNode} routeEl
	 */
	static propTypes = {
		params: PropTypes.shape({
			api: PropTypes.string.isRequired,
		}),
		locations: PropTypes.object,
		routeEl: PropTypes.func.isRequired,
	}
	static defaultProps = {
		params: { api: '' },
	}

	shortLink = this.props.params.api

	/**
	 * Finds the instance object with the same shortLink as the current component's shortLink property.
	 * @returns {Object|null} - The instance object with the matching shortLink or null if not found.
	 */
	myInstance = () => {
		return instances.find((el) => el.shortLink === this.shortLink) || null
	}

	instanceApi = this.myInstance()?.api
	authLink = 'auth_' + this.myInstance()?.shortLink

	/**
	 * Retrieves the user profile information from the API.
	 * @param {object} auth - The authentication object.
	 */
	getProfile = (auth) => {
		const { t } = this.context
		getProfileHelper(t, this.instanceApi, auth.access_token)
			.then((data) => {
				if (data.error) throw data

				// Set the component state with the retrieved data.
				this.setState({
					auth: auth,
					loading: false,
					profile: data,
				})
			})
			.catch((err) => {
				// Log out the user and log the error message to console/toast.
				this.logout()
				checkToast(t, 14001, err)
				console.error(err.error_description)
			})
	}

	/**
	 * Determines whether the current user has editor role.
	 * @returns {boolean} - True if the user has editor role, false otherwise.
	 */
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

	/**
	 * Logs in the user with the provided username and password.
	 * @param {string} username - The username of the user.
	 * @param {string} password - The password of the user.
	 */
	login = (username, password) => {
		const { t } = this.context
		loginHelper(t, this.instanceApi, username, password)
			.then((data) => {
				if (data.error) throw data
				saveLS(this.authLink, data)

				this.setState({
					auth: data,
				})
				this.getProfile(data)
			})
			.catch((error) => {
				// Display a toast message based on the error type.
				if (error.error_description === 'Invalid credentials!') {
					checkToast(t, 11002, error)
				} else {
					checkToast(t, 11005, error)
				}
			})
	}

	// Logs out the user by removing their authentication from local storage and resetting the component's state.
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

	/**
	 * Checks if the provided authentication is valid.
	 * @param {Object} auth - The user authentication object.
	 * @returns {boolean} - Whether the authentication is valid or not.
	 */
	checkValidAuth = (auth) => {
		var nowUnix = Math.round(new Date().getTime() / 1000)
		if (!auth || nowUnix > auth.expiration_time) {
			return false
		}
		return true
	}

	/**
	 * Sets the current breadcrumb state of the component.
	 * @param {string} key - The key of the breadcrumb.
	 * @param {string} value - The value of the breadcrumb.
	 */
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

	// Checks if the user has a valid authentication and gets their profile if so.
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
							<Route path="/" element={<Login />} />

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
