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
import defaultValues from '../../shared/backend/defaultValues'
import checkToast from '../../shared/helper/toastHandler/checkToast'

// TODO: Sort imports

/**
 * InstanceRouter component that handles authentication and user profile for a specific instance.
 */
export default class InstanceRouter extends Component {
	/**
	 * The contextType of the component.
	 */
	static contextType = Context

	/**
	 * The initial state of the component.
	 */
	state = {
		auth: null, // User authentication information
		loading: true, // Loading state of the component
		profile: null, // User profile information
		currentBreadcrumb: {}, // Current breadcrumb state of the component
	}

	/**
	 * The shortLink of the instance.
	 */
	shortLink = this.props.params.api

	/**
	 * Finds the instance object for the current shortLink.
	 * @returns The instance object if found, false otherwise.
	 */
	myInstance = () => {
		var myInst = instances.find((el) => el.shortLink === this.shortLink)
		if (typeof myInst === 'undefined') {
			return false
		}
		return myInst
	}

	/**
	 * The API endpoint for the instance.
	 */
	api = this.myInstance().api

	/**
	 * The authentication local storage key for the instance.
	 */
	authLink = 'auth_' + this.myInstance().shortLink

	/**
	 * Retrieves the user profile information from the API.
	 * @param {object} auth - The authentication object.
	 */
	getProfile = (auth) => {
		getProfileHelper(this.api, auth.access_token)
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
				// Log out the user and log the error message to console.
				this.logout()
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
		loginHelper(this.api, username, password)
			.then((data) => {
				if (data.error) throw data
				saveLS(this.authLink, data)

				// Set the component state with the retrieved authentication data and user profile information.
				this.setState({
					auth: data,
				})
				this.getProfile(data)
			})
			.catch((error) => {
				// Display a toast message based on the error type.
				if (error.error_description === 'Invalid credentials!') {
					checkToast(11002, error)
				} else {
					checkToast(11005, error)
				}
			})
	}
	/**
	 * Logs out the user by removing their authentication from local storage and resetting the component's state.
	 */
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
	/**
	 * Called immediately after the component is mounted. Checks if the user has a valid authentication and gets their profile if so.
	 */
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

	/**
	 * Renders the component with the current state and context values.
	 * If there is no instance available, redirects to the home page.
	 * If the component is still loading, displays a loading spinner.
	 * Otherwise, renders the main application with the current user authentication, profile, and breadcrumb state.
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
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
