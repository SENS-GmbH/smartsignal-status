import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import Context from '#context'

import { XyzTransition } from '@animxyz/react'
import DayNightToggle from 'react-day-and-night-toggle'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'

import { Button } from 'flowbite-react'
import Footer from './Footer'
import checkToast from '#helper/toastHandler/checkToast'

/**
 * A sidebar component that displays a navigation menu with buttons to switch between different pages, as well as buttons to toggle dark mode, change language, force reload the page, and log out.
 * It also displays the username of the currently logged-in user, if available.
 * @component
 * @example
 * <Sidebar />
 */
export default class Sidebar extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {boolean} sidebar - A boolean indicating whether the sidebar is currently open or closed.
	 * @property {Object} changeDarkMode - A function to toggle dark mode on and off.
	 * @property {boolean} darkMode - A boolean indicating whether dark mode is currently enabled or not.
	 * @property {Function} changeSidebar - A function to toggle the sidebar menu on and off.
	 * @property {Object} auth
	 * @property {Function} logout
	 * @property {Function} changeLanguage
	 * @param {string} - language
	 * @property {Object} profile - An object containing information about the currently logged-in user, if available.
	 */
	static contextType = Context

	render() {
		const {
			sidebar,
			changeDarkMode,
			darkMode,
			changeSidebar,
			auth,
			logout,
			changeLanguage,
			profile,
		} = this.context
		return (
			<XyzTransition xyz="fade">
				{sidebar && (
					<div className="z-[500] -pt-16 h-[calc(100vh_-_4rem)] backdrop-blur absolute w-full px-8">
						<div className="relative h-full">
							<div className="flex pt-8 justify-between">
								<div className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite">
									<DayNightToggle
										onChange={changeDarkMode}
										checked={darkMode}
										animationInactive={false}
										className="w-5"
									/>
								</div>
								<div className="flex gap-4">
									<div className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite">
										<NavLink
											to="/"
											onClick={changeSidebar.bind(this)}
										>
											<FontAwesomeIcon
												icon={faHouse}
												size="2x"
											/>
										</NavLink>
									</div>

									{auth && (
										<>
											{/* TODO: Openuser form programmieren */}
											<button
												className="cursor-not-allowed"
												onClick={() =>
													checkToast(
														this.context.t,
														10004
													)
												}
											>
												<FontAwesomeIcon
													icon={faUser}
													size="2x"
													className="opacity-60"
												/>
											</button>
											<button
												className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite"
												onClick={logout}
											>
												<FontAwesomeIcon
													icon={faSignOut}
													size="2x"
												/>
											</button>
										</>
									)}
								</div>
							</div>
							<div className="mt-12 flex flex-col space-y-3">
								{/* TODO: Andere Buttons */}
								<Button onClick={() => changeLanguage('de')}>
									Deutsch
								</Button>
								<Button onClick={() => changeLanguage('en')}>
									English
								</Button>
								<Button
									color="red"
									onClick={() => window.location.reload(true)}
								>
									Force Reload
								</Button>
								<Button
									color="red"
									onClick={() => {
										logout()
										localStorage.clear()
									}}
								>
									Clear Local Storage
								</Button>
							</div>
							<div className="absolute bottom-4 text-sm w-full">
								{profile && (
									<p className="text-center">
										{profile.username}
									</p>
								)}
								<Footer />
							</div>
						</div>
					</div>
				)}
			</XyzTransition>
		)
	}
}
