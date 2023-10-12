import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import Context from '#context'

import instances from '#shared/backend/instances.json'
import sensbg from '#shared/media/sens.mp4'

import { Button } from 'flowbite-react'
import Footer from '../Structure/Footer'
import Logo from '#shared/components/Wrapper/Logo'

// TODO: Clean up classNames (maybe combine)
// TODO: Überarbeiten (Panels kleiner & Buttons entfernen)

/**
 * React component for the Home page
 *
 * @component
 * @example
 * <Home />
 */
export default class Home extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Object} changeDarkMode - A function to toggle dark mode on and off.
	 */
	static contextType = Context

	render() {
		const isDarkMode = this.context.darkMode
		const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white'
		const gradientColor = isDarkMode
			? 'rgba(31,41,55,1)'
			: 'rgba(255,255,255,1)'
		const gradientColorTransparent = isDarkMode
			? 'rgba(31,41,55,0)'
			: 'rgba(255,255,255,0)'

		return (
			<>
				<div className="h-36 relative">
					<video
						autoPlay
						loop
						muted
						playsInline
						className="h-full object-cover w-full absolute"
					>
						<source src={sensbg} type="video/mp4" />
					</video>
					<div
						style={{
							background: `linear-gradient(0deg, ${gradientColor} 20%, ${gradientColorTransparent} 100%)`,
						}}
						className={`${bgColor} h-full absolute z-50 w-full`}
					/>
				</div>

				<div className="w-full px-8 grid sm:grid-cols-2 gap-4 mt-8">
					{instances.map((inst, i) => (
						<div key={i}>
							<NavLink to={inst.shortLink}>
								<div
									className={`flex rounded-lg border border-gray-200 shadow-md dark:border-gray-700 flex-col overflow-hidden ${bgColor}`}
								>
									<div className="h-32 flex justify-center p-3">
										<Logo
											instance={inst}
											className="object-contain"
										/>
									</div>
									<div className="flex h-full flex-col justify-center gap-4 p-6">
										<h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
											{inst.Button}
										</h5>
									</div>
								</div>
							</NavLink>
						</div>
					))}
				</div>
				<div className="px-8 mt-8 pb-1">
					<Footer />
				</div>
			</>
		)
	}
}
