import React, { Component } from 'react'
import { XyzTransition } from '@animxyz/react'
import DayNightToggle from 'react-day-and-night-toggle'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'

import { Context } from '../../shared/context'
import { NavLink } from 'react-router-dom'
import Footer from './Footer'
import { Button } from 'flowbite-react'

// TODO: Scollen des Blureffekts, wenn Content größer als Screen

export default class Sidebar extends Component {
	static contextType = Context
	render() {
		return (
			<XyzTransition xyz="fade">
				{this.props.sidebar && (
					<div className="z-50 -pt-16 h-[calc(100vh_-_4rem)] backdrop-blur absolute w-full px-8">
						<div className="relative h-full">
							<div className="flex pt-8 justify-between">
								<div className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite">
									<DayNightToggle
										onChange={this.context.changeDarkMode}
										checked={this.context.darkMode}
										animationInactive={false}
										className="w-5"
									/>
								</div>
								<div className="flex gap-4">
									<div className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite">
										<NavLink
											to="/"
											onClick={this.context.changeSidebar.bind(
												this
											)}
										>
											<FontAwesomeIcon
												icon={faHouse}
												size="2x"
											/>
										</NavLink>
									</div>

									{this.context.auth && (
										<>
											{/* TODO: Openuser form programmieren */}
											<button
												className="cursor-not-allowed"
												onClick={() =>
													console.log('openUser')
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
												onClick={this.context.logout}
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
							<div className="mt-12">
								{/* TODO: Andere Buttons */}
								<Button
									onClick={() =>
										this.context.changeLanguage('de')
									}
								>
									Deutsch
								</Button>
								<Button
									onClick={() =>
										this.context.changeLanguage('en')
									}
								>
									English
								</Button>
							</div>
							<div className="absolute bottom-4 text-sm w-full">
								{this.context.profile && (
									<p className="text-center">
										{this.context.profile.username}
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
