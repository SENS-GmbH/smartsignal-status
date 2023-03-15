import React, { Component } from 'react'
import { UserContext } from '../../shared/context'

import { Button, Label, TextInput } from 'flowbite-react'

// import { Input, Button } from '@material-tailwind/react'

/**
 * Login
 */
export default class Login extends Component {
	static contextType = UserContext

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
						src="https://senswww.apps.iotp.kapschcloud.net/sens/sens/sens_logo_trans.png"
						alt="SmartSignal_Logo"
						className="max-h-full mx-auto"
					/>
				</div>
				<form className="flex flex-col gap-4">
					<div>
						<div className="mb-2 block">
							<Label htmlFor="email" value="Your email" />
						</div>
						<TextInput
							name="username"
							id="email"
							placeholder="name@flowbite.com"
							required={true}
							onChange={this.onChange}
						/>
					</div>
					<div>
						{/* TODO: Diffrent Colors in Input - Selbst Inputfeld gestalten */}
						<div className="mb-2 block">
							<Label htmlFor="password1" value="Your password" />
						</div>
						<TextInput
							name="Password"
							id="password1"
							onChange={this.onChange}
							type="password"
							required={true}
						/>
					</div>
					<Button
						type="submit"
						onClick={(e) => {
							e.preventDefault()
							this.context.login(
								this.state.username,
								this.state.password
							)
						}}
					>
						Submit
					</Button>
				</form>
			</div>
		)
	}
}
