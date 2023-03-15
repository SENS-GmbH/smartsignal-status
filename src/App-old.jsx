import React, { Component } from 'react'
// import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Context } from './shared/context.js'

import AfterLine from './shared/components/AfterLine.jsx'
import Router from './components/Router'

import helperLogin from './shared/helper/Fetch API/login'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '@material-tailwind/react'
import checkError from './shared/helper/checkError.js'

export default class App extends Component {
	static contextType = Context

	state = {
		auth: null,
		apiServer: 'https://commonapi-smartsignal.iot.kapschcloud.net/api',
		firstLoading: true,
		profile: null,
		tenant: null,
	}

	getProfile = (auth) => {
		var nowUnix = Math.round(new Date().getTime() / 1000)

		if (!auth || nowUnix > auth.expiration_time) {
			this.setState({ firstLoading: false })
			return
		}

		fetch(`${this.state.apiServer}/Users/Profile`, {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + auth.access_token },
		})
			.then((response) => response.json())
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
				checkError({ message: err.error_description })
			})
	}

	login = (username, password) => {
		if (username === '' || password === '') {
			checkError({ message: 'Please enter credentials!' })
			return
		}
		this.setState({ firstLoading: true })
		helperLogin(username, password)
			.then((resp) => {
				this.getProfile(resp)
			})
			.catch((err) => {
				this.setState({ firstLoading: false })
				checkError({ message: err.error_description })
			})
	}

	logout = () => {
		localStorage.removeItem('auth')
		this.setState({ auth: null, firstLoading: false })
	}

	componentDidMount = () => {
		var auth = localStorage.getItem('auth')
		this.getProfile(JSON.parse(auth))
	}

	render() {
		return <></>
		/*
		return (
			<Context.Provider
				value={{
					apiServer: this.state.apiServer,
					auth: this.state.auth,
					changeTenant: (tenant) => this.setState({ tenant: tenant }),
					checkError: this.context.checkError,
					client: this.context.client,
					firstLoading: this.state.firstLoading,
					login: this.login,
					profile: this.state.profile,
				}}
			>
				{this.state.auth && (
					<header className="z-10 h-14 truncate top-0 sticky w-full">
						<div className="text-center h-full bg-gray-50 flex justify-between mx-4 items-center">
							<div>{this.state.profile.username}</div>
							<IconButton onClick={this.logout.bind(this)}>
								<FontAwesomeIcon icon={faSignOut} />
							</IconButton>
						</div>
						<AfterLine />
					</header>
				)}
				<div className="h-screen">
					<Router />
				</div>

				<ToastContainer
					position="top-center"
					autoClose={2000}
					hideProgressBar
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss={false}
					draggable
					pauseOnHover={false}
					limit={1}
				/>
			</Context.Provider>
		) */
	}
}
