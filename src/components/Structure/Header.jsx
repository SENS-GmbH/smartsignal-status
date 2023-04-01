import React, { Component } from 'react'
import { Squash as Hamburger } from 'hamburger-react'

import { Context } from '../../shared/context'

import Sidebar from './Sidebar'

import headerPhoto from '../../shared/media/header.png'

/**
 * React component for the header.
 * @component
 * @example
 * <Header />
 */
export default class Header extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {boolean} sidebar - Boolean indicating if the sidebar is open or not.
	 * @property {Function} changeSidebar - Function for changing the sidebar state.
	 * @property {boolean} darkMode - Boolean indicating if dark mode is enabled or not.
	 */
	static contextType = Context

	render() {
		const { darkMode, sidebar, changeSidebar } = this.context
		return (
			<div className="relative">
				<div className="h-16 w-full relative">
					<div className="h-full absolute w-full">
						<div className="h-full absolute w-full top-0 bg-white dark:bg-gray-800"></div>
						<img
							src={headerPhoto}
							alt="Header"
							className={`${
								darkMode ? 'opacity-60' : 'opacity-90'
							} h-full w-full object-cover backdrop-blur shadow-md`}
						/>
					</div>
					<div className="absolute right-4 h-full">
						<div className="flex items-center h-full">
							<Hamburger
								color="#fff"
								duration={0.5}
								size={30}
								toggled={sidebar}
								toggle={changeSidebar.bind(this)}
							/>
						</div>
					</div>
				</div>
				<Sidebar />
			</div>
		)
	}
}
