import React, { Component } from 'react'

import { InstanceContext, UserContext } from '../../shared/context'

import Header from '../Structure/Header'
import InstanceRouter from './Router'

import {
	loginHelper,
	getProfileHelper,
} from '../../shared/helper/Fetch API/login'
import { getLS, removeLS, saveLS } from '../../shared/helper/localStorage'
import checkError from '../../shared/helper/checkError'
import { Navigate } from 'react-router-dom'
import { LoadingScreen } from '../../shared/components/LoadingScreen.jsx'
import BreadcrumbContainer from '../../shared/components/Breadcrumbs/BreadcrumbContainer'

export default class Instance extends Component {
	static contextType = InstanceContext
	state = {
		auth: null,
		username: '',
		profile: null,
		loggedOut: false,
		firstLoading: true,
	}

	authLink = 'auth_' + this.context.instance.shortLink

	login = (username, password) => {
		loginHelper(this.context.instance.api, username, password)
			.then((data) => {
				if (data.error) throw data
				saveLS(this.authLink, data)
				this.setState({
					auth: data,
					username: username,
					loggedOut: false,
				})
			})
			.catch((error) => {
				checkError(error)
			})
	}

	logout = () => {
		removeLS(this.authLink)
		this.setState({
			auth: null,
			username: '',
			loggedOut: true,
			firstLoading: false,
		})
		window.location.href = '/' + this.context.instance.shortLink
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
					firstLoading: false,
					auth: auth,
				})
			})
			.catch((err) => {
				this.logout()
				checkError(err.error_description)
			})
	}

	componentDidMount = () => {
		var myAuth = JSON.parse(getLS(this.authLink))
		if (myAuth && myAuth.access_token) {
			this.getProfile(myAuth)
		} else {
			this.setState({ firstLoading: false })
		}
	}

	render() {
		if (this.state.loggedOut) {
			return <Navigate to="/" />
		}
		if (this.state.firstLoading) {
			return <LoadingScreen.Spinner />
		}
		return (
			<UserContext.Provider
				value={{
					auth: this.state.auth,
					profile: this.state.profile,
					username: this.state.username,
					login: this.login.bind(this),
					logout: this.logout.bind(this),
				}}
			>
				<Header />
				<BreadcrumbContainer />
				<InstanceRouter />
			</UserContext.Provider>
		)
	}
}
