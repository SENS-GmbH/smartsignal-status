import React, { Component, Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import { Context } from '../context'
import Logo from './Wrapper/Logo'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default class Breadcrumb extends Component {
	static contextType = Context

	currentTenantName = ''
	currentUsecaseName = this.context.t('test.usecase')
	currentDeviceName = this.context.t('test.device')

	splitedLocation = (path) => {
		var newPath = path.split('/')
		newPath.shift()
		return newPath
	}

	allLocation = (path) => {
		var newPath = this.splitedLocation(path)
		var array = [
			{
				name: (
					<div className="text-xl">
						<FontAwesomeIcon icon={faHome} />
					</div>
				),
				path: 'tenant',
			},
		]
		if (!this.context.auth) {
			return array
		}
		for (let i = 1; i < newPath.length; i = i + 2) {
			const key = newPath[i]
			switch (key) {
				case 'tenant':
					if (newPath[i + 1]) {
						array.push({
							name: this.context.currentBreadcrumb.tenant,
							path: newPath[i + 1],
						})
					}
					break

				case 'usecase':
					array.push({ name: 'Use-Cases', path: key })
					if (newPath[i + 1]) {
						array.push({
							name: this.context.currentBreadcrumb.usecase,
							path: newPath[i + 1],
						})
					}
					break

				case 'device':
					// array.push({ name: 'Geräte', path: key })
					if (newPath[i + 1]) {
						array.push({
							name: this.context.currentBreadcrumb.device,
							path: newPath[i + 1],
						})
					}
					break
				case 'addDevice':
					array.push({
						name: this.context.t(
							this.context.currentBreadcrumb.addDevice
						),
						path: '',
					})
					break

				default:
					break
			}
		}
		return array
	}

	getLink = (pathString) => {
		var path = this.props.locations.pathname
		var myIndex = path.indexOf('/', path.indexOf(pathString))
		var text = path
		if (myIndex >= 0) {
			text = path.substring(0, myIndex)
		}
		return text
	}

	render() {
		return (
			<div className="h-12 dark:bg-gray-700 bg-white flex items-center">
				<div className="h-full w-24 flex bg-white shadow-smRight p-1.5">
					<Logo
						className="object-contain"
						instance={this.context.instance}
					/>
				</div>
				<div className="text-sm h-full w-full pl-3  shadow-smLeft overflow-x-auto">
					<ol className="flex h-full items-center">
						{this.allLocation(this.props.locations.pathname).map(
							(crumb, i) => (
								<Fragment key={i + '_Breadcrumb'}>
									<li className="px-0.5 max-w-[160px] first-of-type:min-w-fit min-w-[120px] truncate">
										<NavLink to={this.getLink(crumb.path)}>
											{crumb.name}
										</NavLink>
									</li>
									<li className="last:hidden px-2">/</li>
								</Fragment>
							)
						)}
					</ol>
				</div>
			</div>
		)
	}
}
