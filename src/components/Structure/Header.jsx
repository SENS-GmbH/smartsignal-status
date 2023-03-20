import React, { Component } from 'react'
import { Squash as Hamburger } from 'hamburger-react'

import headerPhoto from '../../shared/media/header.png'

import Sidebar from './Sidebar'
import { Context } from '../../shared/context'

export default class Header extends Component {
	static contextType = Context

	render() {
		return (
			<div className="relative">
				<div className="h-16 w-full relative">
					<div className="h-full absolute w-full">
						<div className="h-full absolute w-full top-0 bg-white dark:bg-gray-800"></div>
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
								toggled={this.context.sidebar}
								toggle={this.context.changeSidebar.bind(this)}
							/>
						</div>
					</div>
				</div>
				<Sidebar sidebar={this.context.sidebar} />
			</div>
		)
	}
}
