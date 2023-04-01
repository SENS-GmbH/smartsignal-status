/**
 * @typedef {Object} LocationShape
 * @property {string} pathname - The path of the location.
 * @property {...*} [otherProps] - Additional properties that may be present in the location.
 */

import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Context } from '../context'

import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Logo from './Wrapper/Logo'

/**
 * React component for the Breadcrumbs.
 *
 * @component
 * @example
 * <Wrap routeEl={Breadcrumb} />
 */
export default class Breadcrumb extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Object} currentBreadcrumb - The current breadcrumb object.
	 * @property {Object} auth - The authentication object.
	 * @property {Object} instance - The instance object.
	 * @property {Function} t - The translation function.
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {LocationShape} locations - The locations object.
	 */
	static propTypes = {
		locations: PropTypes.shape({
			pathname: PropTypes.string.isRequired,
		}),
		params: PropTypes.object,
		routeEl: PropTypes.func.isRequired,
	}
	static defaultProps = {
		locations: { pathname: '' },
	}

	/**
	 * Splits the given path string into an array.
	 * @param {string} path - The path string to split.
	 * @returns {Array<string>} - The array of split path strings.
	 */
	splitedLocation = (path) => {
		var newPath = path.split('/')
		newPath.shift()
		return newPath
	}

	/**
	 * Returns an array of all the location objects for the given path string.
	 * @param {string} path - The path string.
	 * @returns {Array<Object>} - An array of location objects.
	 */
	allLocation = (path) => {
		var currentBreadcrumb = this.context.currentBreadcrumb
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
		newPath.forEach((key, i) => {
			if (i % 2 === 0) {
				switch (key) {
					case 'tenant':
						if (newPath[i + 1]) {
							array.push({
								name: currentBreadcrumb.tenant,
								path: newPath[i + 1],
							})
						}
						break

					case 'usecase':
						array.push({ name: 'Use-Cases', path: key })
						if (newPath[i + 1]) {
							array.push({
								name: currentBreadcrumb.usecase,
								path: newPath[i + 1],
							})
						}
						break

					case 'device':
						// array.push({ name: 'Geräte', path: key })
						if (newPath[i + 1]) {
							array.push({
								name: currentBreadcrumb.device,
								path: newPath[i + 1],
							})
						}
						break
					case 'addDevice':
						array.push({
							name: this.context.t(currentBreadcrumb.addDevice),
							path: '',
						})
						break

					default:
						break
				}
			}
		})
		return array
	}

	/**
	 * Returns the link for the given path string.
	 * @param {string} pathString - The path string.
	 * @returns {string} - The link string.
	 */
	getLink = (pathString) => {
		const path = this.props.locations.pathname
		const myIndex = path.indexOf('/', path.indexOf(pathString))
		return myIndex >= 0 ? path.substring(0, myIndex) : path
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
