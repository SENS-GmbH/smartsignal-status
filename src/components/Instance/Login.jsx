import React, { Component } from 'react'
import { Context } from '../../shared/context'
import { onChange } from '../../shared/helper/onChange'

import { Button } from 'flowbite-react'
import Input from '../../shared/components/Custom/Input'
import { forgotHelper } from '../../shared/helper/Fetch API/login'
import checkError from '../../shared/helper/checkError'

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

	myInstance = () => {
		var myInst = instances.find(
			(el) => el.shortLink === this.props.params.api
		)
		if (typeof myInst === 'undefined') {
			return false
		}
		return myInst
	}

	render() {
		return (
			<div className="flex flex-col space-y-4 pt-10">
				<div className="mb-4 h-36 w-auto">
					<Logo
						instance={this.myInstance()}
						className="max-h-full mx-auto"
					/>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						if (this.state.forgot) {
							forgotHelper(
								this.myInstance().api,
								this.state.username
							).then(() => {
								checkError(
									this.context.t(
										'toast.success.resetPasswort'
									)
								)
							})
						} else {
							this.context.login(
								this.state.username,
								this.state.password
							)
						}
					}}
					className="flex flex-col gap-4"
				>
					<div>
						<Input
							className="mb-4"
							name="username"
							onChange={(e) =>
								onChange(e, (data) => {
									this.setState(data)
								})
							}
							value={this.state.username}
							required={true}
							type="text"
						>
							{this.context.t('login.login.email')}
						</Input>
						{!this.state.forgot && (
							<Input
								className="mb-2"
								name="password"
								onChange={(e) =>
									onChange(e, (data) => {
										this.setState(data)
									})
								}
								value={this.state.password}
								type="password"
								required={true}
							>
								{this.context.t('login.login.password')}
							</Input>
						)}
					</div>

					<Button type="submit">
						{this.state.forgot && (
							<span>{this.context.t('login.forgot.submit')}</span>
						)}
						{!this.state.forgot && (
							<span>{this.context.t('login.login.submit')}</span>
						)}
					</Button>
				</form>
				<button
					onClick={() =>
						this.setState({ forgot: !this.state.forgot })
					}
					className="text-center underline"
				>
					{this.state.forgot && (
						<span>{this.context.t('login.forgot.login')}</span>
					)}
					{!this.state.forgot && (
						<span>{this.context.t('login.forgot.forgot')}</span>
					)}
				</button>
			</div>
		)
	}
}
