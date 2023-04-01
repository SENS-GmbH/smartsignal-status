/**
 *
 * Login Component
 * @description This component handles the login process for the application, including authentication and password recovery
 * @exports Login
 * @component
 */
import React, { Component } from 'react'
import { Context } from '../../shared/context'
import { onChange } from '../../shared/helper/onChange'
import { Button } from 'flowbite-react'
import Input from '../../shared/components/Custom/Input'
import { forgotHelper } from '../../shared/helper/Fetch API/login'
import checkToast from '../../shared/helper/toastHandler/checkToast'
import instances from '../../shared/backend/instances.json'
import Logo from '../../shared/components/Wrapper/Logo'

export default class Login extends Component {
	static contextType = Context

	state = {
		username: '',
		password: '',
		loading: false,
		forgot: false,
	}

	/**
	 * Returns the instance object that matches the `params.api` property in the route. If there is no match, returns `false`.
	 * @returns {object|boolean}
	 */
	myInstance = () => {
		const { params } = this.props
		const myInst = instances.find((inst) => inst.shortLink === params.api)
		return myInst || false
	}

	/**
	 * Handles the form submission for logging in and password recovery. If the `forgot` state is true, sends a password recovery request. Otherwise, sends a login request.
	 * @param {event} e The event object from the form submission.
	 */
	handleLoginSubmit = (e) => {
		e.preventDefault()
		const { forgot, username, password } = this.state
		if (forgot) {
			forgotHelper(this.myInstance().api, username).then(() => {
				checkToast(11180)
			})
		} else {
			this.context.login(username, password)
		}
	}

	/**
	 * Toggles the `forgot` state when the "Forgot Password" button is clicked.
	 */
	handleForgotClick = () => {
		this.setState((prevState) => ({ forgot: !prevState.forgot }))
	}

	/**
	 * Renders the login form fields (username and password inputs).
	 * @returns {JSX.Element} The login form JSX.
	 */
	renderLoginForm = () => {
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
					{this.context.t('login.login.email')}
				</Input>
				<Input
					className="mb-2"
					name="password"
					onChange={(e) => onChange(e, (data) => this.setState(data))}
					value={password}
					type="password"
					required={true}
				>
					{this.context.t('login.login.password')}
				</Input>
			</div>
		)
	}

	/**
	 * Render a form for forgotten password
	 *
	 * @returns {JSX.Element} The rendered component
	 */
	renderForgotForm = () => {
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
					{this.context.t('login.login.email')}
				</Input>
			</div>
		)
	}

	render() {
		const { forgot } = this.state
		return (
			<div className="flex flex-col space-y-4 pt-10">
				<div className="mb-4 h-36 w-auto">
					<Logo
						instance={this.myInstance()}
						className="max-h-full mx-auto"
					/>
				</div>
				<form
					onSubmit={this.handleLoginSubmit}
					className="flex flex-col gap-4"
				>
					{forgot ? this.renderForgotForm() : this.renderLoginForm()}
					<Button type="submit">
						{forgot
							? this.context.t('login.forgot.submit')
							: this.context.t('login.login.submit')}
					</Button>
				</form>
				<button
					onClick={this.handleForgotClick}
					className="text-center underline"
				>
					{forgot
						? this.context.t('login.forgot.login')
						: this.context.t('login.forgot.forgot')}
				</button>
			</div>
		)
	}
}
