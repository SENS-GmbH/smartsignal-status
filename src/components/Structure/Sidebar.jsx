import React, { Component } from 'react'
import { XyzTransition } from '@animxyz/react'
import DayNightToggle from 'react-day-and-night-toggle'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'

import { Context, UserContext } from '../../shared/context'
import { NavLink } from 'react-router-dom'
import Footer from './Footer'

// TODO: Scollen des Blureffekts, wenn Content größer als Screen

export default class Sidebar extends Component {
	static contextType = UserContext
	render() {
		return (
			<XyzTransition xyz="fade">
				{this.props.sidebar && (
					<div className="z-50 -pt-16 h-[calc(100vh_-_4rem)] backdrop-blur absolute w-full px-8">
						<div className="relative h-full">
							<div className="flex pt-8 justify-between">
								<Context.Consumer>
									{(context) => (
										<div className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite">
											<DayNightToggle
												onChange={
													context.changeDarkMode
												}
												checked={context.darkMode}
												animationInactive={false}
												className="w-5"
											/>
										</div>
									)}
								</Context.Consumer>
								<div className="flex gap-4">
									<div className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite">
										<NavLink to="/">
											<FontAwesomeIcon
												icon={faHouse}
												size="2x"
											/>
										</NavLink>
									</div>
									{/* TODO: Openuser form programmieren */}
									<button
										className="cursor-not-allowed"
										onClick={() => console.log('openUser')}
									>
										<FontAwesomeIcon
											icon={faUser}
											size="2x"
											className="opacity-60"
										/>
									</button>

									{this.context.auth && (
										<button
											className="hover:drop-shadow-fullBlack dark:hover:drop-shadow-fullWhite"
											onClick={this.context.logout}
										>
											<FontAwesomeIcon
												icon={faSignOut}
												size="2x"
											/>
										</button>
									)}
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
		)
	}
}
