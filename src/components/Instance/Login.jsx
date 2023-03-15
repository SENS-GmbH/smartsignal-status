import React, { Component } from 'react'
import { InstanceContext, UserContext } from '../../shared/context'

import { Button, Label, TextInput } from 'flowbite-react'
import { NavLink } from 'react-router-dom'

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
					<InstanceContext.Consumer>
						{(instance) => (
							<img
								src={instance.instance.Logo}
								alt={instance.instance.Button}
								className="max-h-full mx-auto"
							/>
						)}
					</InstanceContext.Consumer>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						this.context.login(
							this.state.username,
							this.state.password
						)
					}}
					className="flex flex-col gap-4"
				>
					<div>
						<div className="mb-2 block">
							<Label htmlFor="email" value="Your email" />
						</div>
						<TextInput
							name="username"
							id="email"
							placeholder="mail@example.com"
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
					<Button type="submit">Submit</Button>
				</form>
				<NavLink to="tenant/25">
					<Button>Zu Tenant 25 wechseln</Button>
				</NavLink>
				<NavLink to="tenant/25/usecase/20472">
					<Button>Und Usecase 20472</Button>
				</NavLink>
			</div>
		)
	}
}
