import React, { Component } from 'react'
import { Squash as Hamburger } from 'hamburger-react'

import headerPhoto from '../../shared/media/header.png'

import Sidebar from './Sidebar'
import { Context } from '../../shared/context'

export default class Header extends Component {
	static contextType = Context
	state = { sidebar: false }

	openSidebar = () => {
		this.setState({ sidebar: !this.state.sidebar })
	}

	render() {
		return (
			<div className="relative">
				<div className="h-16 w-full relative">
					<div className="h-full absolute w-full">
						<img
							src={headerPhoto}
							alt="Header"
							className={
								(this.context.darkMode
									? 'opacity-60'
									: 'opacity-90') +
								' h-full w-full object-cover backdrop-blur shadow-md'
							}
						/>
					</div>
					<div className="absolute right-4 h-full">
						<div className="flex items-center h-full">
							<Hamburger
								color="#fff"
								duration={0.5}
								size={30}
								toggled={this.state.sidebar}
								toggle={this.openSidebar.bind(this)}
							/>
						</div>
					</div>
				</div>
				<Sidebar sidebar={this.state.sidebar} />
			</div>
		)
	}
}
