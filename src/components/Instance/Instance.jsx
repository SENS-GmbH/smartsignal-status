import React, { Component } from 'react'

import { InstanceContext, UserContext } from '../../shared/context'

import Header from '../Header/Header'
import InstanceRouter from './Router'

import loginHelper from '../../shared/helper/Fetch API/login'
import { saveLS } from '../../shared/helper/localStorage'
import checkError from '../../shared/helper/checkError'

export default class Instance extends Component {
	static contextType = InstanceContext
	state = {
		auth: null,
		username: '',
	}

	login = (username, password) => {
		loginHelper(this.context.instance.api, username, password)
			.then((data) => {
				if (data.error) throw data
				saveLS('auth_' + this.context.instance.shortLink, data)
				this.setState({ auth: data, username: username })
			})
			.catch((error) => {
				checkError(error)
			})
	}

	logout = () => {
		localStorage.removeItem('auth_' + this.context.instance.shortLink)
		this.setState({ auth: null, username: '' })
	}

	render() {
		return (
			<UserContext.Provider
				value={{
					auth: this.state.auth,
					username: this.state.username,
					login: this.login.bind(this),
					logout: this.logout.bind(this),
				}}
			>
				<Header />
				<InstanceRouter />
			</UserContext.Provider>
		)
	}
}
