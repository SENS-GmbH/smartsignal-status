import React, { Component } from 'react'

import Context from '#context'

import { forgotHelper } from '#helper/Fetch API/login'
import { onChange } from '#helper/onChange'
import checkToast from '#helper/toastHandler/checkToast'

import { Button } from 'flowbite-react'
import Input from '#comp/Custom/Input'
import Logo from '#comp/Wrapper/Logo'

/**
 * Handles the login process for the application, including authentication and password recovery.
 *
 * @component
 * @example
 * <Login />
 */
export default class Login extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Object} instance
	 * @property {Function} login
	 * @param {string} - username
	 * @param {string} - password
	 * @property {Function} t
	 */
	static contextType = Context

	state = {
		username: '',
		password: '',
		loading: false,
		forgot: false,
	}

	/**
	 * Handles the form submission for logging in and password recovery. If the `forgot` state is true, sends a password recovery request. Otherwise, sends a login request.
	 * @param {event} e The event object from the form submission.
	 */
	handleLoginSubmit = (e) => {
		e.preventDefault()
		const { forgot, username, password } = this.state
		const { t, instance, login } = this.context
		if (forgot) {
			forgotHelper(t, instance.api, username).then(() => {
				checkToast(t, 11101)
			})
		} else {
			login(username, password)
		}
	}

	// Toggles the `forgot` state when the "Forgot Password" button is clicked.
	handleForgotClick = () => {
		this.setState((prevState) => ({ forgot: !prevState.forgot }))
	}

	/**
	 * Renders the login inputs fields (username and password).
	 * @returns {JSX.Element} The login inputs.
	 */
	renderLoginForm = () => {
		const { t } = this.context
		const { username, password } = this.state

		return (
			<div>
				<Input
					className="mb-4"
					name="username"
					onChange={(e) => onChange(e, (data) => this.setState(data))}
					value={username}
					required={true}
					type="text"
				>
					{t('login.login.email')}
				</Input>
				<Input
					className="mb-2"
					name="password"
					onChange={(e) => onChange(e, (data) => this.setState(data))}
					value={password}
					type="password"
					required={true}
				>
					{t('login.login.password')}
				</Input>
			</div>
		)
	}

	/**
	 * Render an input for forgotten password
	 * @returns {JSX.Element} The forgotten password input.
	 */
	renderForgotForm = () => {
		const { t } = this.context
		const { username } = this.state

		return (
			<div>
				<Input
					className="mb-4"
					name="username"
					onChange={(e) => onChange(e, (data) => this.setState(data))}
					value={username}
					required={true}
					type="text"
				>
					{t('login.login.email')}
				</Input>
			</div>
		)
	}

	render() {
		const { instance, t } = this.context
		const { forgot } = this.state

		return (
			<div className="flex flex-col space-y-4 pt-10">
				<div className="mb-4 h-36 w-auto">
					<Logo instance={instance} className="max-h-full mx-auto" />
				</div>
				<form
					onSubmit={this.handleLoginSubmit}
					className="flex flex-col gap-4"
				>
					{forgot ? this.renderForgotForm() : this.renderLoginForm()}
					<Button type="submit">
						{forgot
							? t('login.forgot.submit')
							: t('login.login.submit')}
					</Button>
				</form>
				<button
					onClick={this.handleForgotClick}
					className="text-center underline"
				>
					{forgot
						? t('login.forgot.forgot')
						: t('login.login.forgot')}
				</button>
			</div>
		)
	}
}
