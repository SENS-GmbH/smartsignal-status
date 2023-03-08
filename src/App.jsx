import React, { Component } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Context } from './shared/context.js'

import AfterLine from './shared/components/AfterLine.jsx'
import Router from './components/Router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '@material-tailwind/react'

// TODO: Foto durch Popup erscheinen lassen

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
				this.context.checkError({ message: err.error_description })
			})
	}

	login = (username, password) => {
		if (username === '' || password === '') {
			this.context.checkError({ message: 'Please enter credentials!' })
			return
		}
		this.setState({ firstLoading: true })
		fetch(
			`${this.state.apiServer}/Authentication?username=${username}&password=${password}`,
			{ method: 'POST' }
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.error) throw data
				localStorage.setItem('auth', JSON.stringify(data))
				this.getProfile(data)
			})
			.catch((err) => {
				this.setState({ firstLoading: false })
				this.context.checkError({ message: err.error_description })
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
				<div className="h-full">
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
		)
	}
}
