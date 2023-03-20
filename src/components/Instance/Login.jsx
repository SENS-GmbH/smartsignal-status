import React, { Component } from 'react'
import { Context } from '../../shared/context'
import { onChange } from '../../shared/helper/onChange'

import { Button } from 'flowbite-react'
import Input from '../../shared/components/Custom/Input'

export default class Login extends Component {
	static contextType = Context

	state = {
		username: '',
		password: '',
		loading: false,
	}

	render() {
		return (
			<div className="flex flex-col space-y-4 pt-10">
				<div className="mb-4 h-36 w-auto">
					<img
						src={this.context.instance.Logo}
						alt={this.context.instance.Button}
						className="max-h-full mx-auto"
					/>
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
							{this.context.t('login.email')}
						</Input>
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
							{this.context.t('login.password')}
						</Input>
					</div>

					<Button type="submit">
						{this.context.t('login.submit')}
					</Button>
				</form>
			</div>
		)
	}
}
