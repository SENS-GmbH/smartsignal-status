import React, { Component } from 'react'
import { Squash as Hamburger } from 'hamburger-react'
import { XyzTransition } from '@animxyz/react'
import DayNightToggle from 'react-day-and-night-toggle'

import headerPhoto from '../../shared/media/header.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'

import { Context, UserContext } from '../../shared/context'
import { NavLink } from 'react-router-dom'
import Footer from './Footer'

export default class Header extends Component {
	static contextType = UserContext
	state = { sidebar: false }

	openSidebar = () => {
		this.setState({ sidebar: !this.state.sidebar })
	}

	render() {
		return (
			<div className="relative">
				<div className="h-16 w-full relative">
					<div className="bg-black h-full absolute w-full">
						<img
							src={headerPhoto}
							alt="Header"
							className="h-full w-full object-cover opacity-75 backdrop-blur"
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

				<div className="relative">
					<XyzTransition xyz="fade">
						{this.state.sidebar && (
							<div className="z-50 -pt-16 h-[calc(100vh_-_4rem)] backdrop-blur absolute w-full px-8">
								<div className="relative h-full">
									<div className="flex pt-8 justify-between">
										<Context.Consumer>
											{(context) => (
												<div className="hover:drop-shadow-fullWhite">
													<DayNightToggle
														onChange={
															context.changeDarkMode
														}
														checked={
															context.darkMode
														}
														animationInactive={
															false
														}
														className="w-5"
													/>
												</div>
											)}
										</Context.Consumer>
										<div className="flex gap-4">
											<div className="hover:drop-shadow-fullWhite">
												<NavLink to="/">
													<FontAwesomeIcon
														icon={faHouse}
														size="2x"
													/>
												</NavLink>
											</div>
											{/* TODO: Openuser programmieren */}
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
												className="hover:drop-shadow-fullWhite"
												onClick={this.context.logout}
											>
												<FontAwesomeIcon
													icon={faSignOut}
													size="2x"
												/>
											</button>
										</div>
									</div>
									{/* <div className="">Options</div> */}
									<div className="absolute bottom-4 text-sm w-full">
										<p className="text-center">
											{this.context.username}
										</p>
										<Footer />
									</div>
								</div>
							</div>
						)}
					</XyzTransition>
				</div>
			</div>
		)
	}
}
