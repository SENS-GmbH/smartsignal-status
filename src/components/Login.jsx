import React, { Component } from 'react'
import { Context } from '../shared/context'

import { Input, Button } from '@material-tailwind/react'

/**
 * Login
 */
export default class Login extends Component {
	static contextType = Context

	state = {
		username: '',
		password: '',
		loading: false,
	}

	onChange = (e) => {
		var name = e.target.name.toLowerCase()
		var value = e.target.value
		this.setState({ [name]: value })
	}

	render() {
		return (
			<div className="flex flex-col space-y-4 pt-10 mx-6">
				<div className="mb-4 h-36 w-auto">
					<img
						src="https://senswww.apps.iotp.kapschcloud.net/smartsignal/logo.png"
						alt="SmartSignal_Logo"
						className="max-h-full mx-auto"
					/>
				</div>
				<Input
					name="Username"
					label="Username"
					onChange={this.onChange}
				/>
				<Input
					name="Password"
					label="Password"
					onChange={this.onChange}
					type="password"
				/>
				<Button
					fullWidth
					variant="filled"
					onClick={() =>
						this.context.login(
							this.state.username,
							this.state.password
						)
					}
				>
					Login
				</Button>
			</div>
		)
	}
}
