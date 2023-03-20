import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import { Context } from '../../shared/context'

import instances from '../../shared/backend/instances.json'
import sensbg from '../../shared/media/sens.mp4'

import Footer from '../Structure/Footer'
import { Button } from 'flowbite-react'

// TODO: Clean up classNames

export default class Home extends Component {
	static contextType = Context

	render() {
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
					{this.context.darkMode && (
						<div
							style={{
								background:
									'linear-gradient(0deg, rgba(31,41,55,1) 20%, rgba(31,41,55,0) 100%)',
							}}
							className="bg-gray-800 h-full absolute z-50 w-full"
						/>
					)}
					{!this.context.darkMode && (
						<div
							style={{
								background:
									'linear-gradient(0deg, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%)',
							}}
							className="bg-white h-full absolute z-50 w-full"
						/>
					)}
				</div>
				<div className="w-full px-8 grid sm:grid-cols-2 gap-4 mt-8">
					{instances.map((inst, i) => (
						<div key={i}>
							<NavLink to={inst.shortLink}>
								<div className="flex rounded-lg border  border-gray-200 shadow-md dark:border-gray-700 flex-col overflow-hidden">
									<div className="bg-white">
										<div className="h-32 flex justify-center p-3">
											<img
												src={inst.Logo}
												alt={inst.Button}
												className="object-contain"
											/>
										</div>
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
				<div className="px-8 mt-8">
					<NavLink to="/test">
						<Button className="w-full">Test Cam</Button>
					</NavLink>
				</div>
				<div className="px-8 mt-8">
					<NavLink to="/test/frontend">
						<Button className="w-full">Test Frontend</Button>
					</NavLink>
				</div>
				<div className="px-8 mt-8">
					<Button
						onClick={this.context.changeDarkMode}
						color="success"
						className="w-full"
					>
						Darkmode
					</Button>
				</div>
				<div className="px-8 mt-8 pb-1">
					<Footer />
				</div>
			</>
		)
	}
}
