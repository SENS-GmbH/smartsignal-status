import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Context } from '../context'

import { IconButton, Input } from '@material-tailwind/react'
import AfterLine from './AfterLine'

import {
	faArrowLeft,
	faSearch,
	faRotateRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Toolbar
 *
 * showLoading: Function
 * fetchTenants: Function(value)
 * fetchDevices: Function(id)
 * reset: Function
 * tenant: Object
 * content: String
 */
export default class Toolbar extends Component {
	static contextType = Context

	minLength = 3

	delayFetchTenants
	delayEnter3Chars

	delayInput = (e) => {
		var value = e.target.value
		clearTimeout(this.delayEnter3Chars)
		clearTimeout(this.delayFetchTenants)

		if (value.length < this.minLength) {
			this.delayEnter3Chars = setTimeout(() => {
				this.context.checkError({
					message: 'Enter at least 3 characters',
				})
			}, 1500)
			return
		}

		this.props.showLoading()

		this.delayFetchTenants = setTimeout(() => {
			this.props.fetchTenants(value)
		}, 1500)
	}

	loadContent = (content) => {
		switch (content) {
			case 'tenants':
				return (
					<div className="w-full">
						<Input
							name="Tenant"
							label="Tenant"
							icon={<FontAwesomeIcon icon={faSearch} />}
							onChange={this.delayInput}
						/>
					</div>
				)
			case 'devices':
				if (this.props.tenant === null) {
					return
				}
				return (
					<div className="flex space-x-3 items-center justify-between w-full">
						{this.props.getCount > 1 && (
							<NavLink to={'./'} onClick={this.props.reset}>
								<IconButton>
									<FontAwesomeIcon icon={faArrowLeft} />
								</IconButton>
							</NavLink>
						)}
						<div className="text-center">
							{this.props.tenant.name}
						</div>
						<div>
							<IconButton
								onClick={() => {
									this.props.fetchDevices(
										this.props.tenant.id
									)
								}}
							>
								<FontAwesomeIcon icon={faRotateRight} />
							</IconButton>
						</div>
					</div>
				)

			default:
				break
		}
	}

	render() {
		return (
			<div className="sticky w-full h-20 top-14 bg-gray-50">
				<div className="h-full flex items-center mx-4">
					{this.loadContent(this.props.content)}
				</div>
				<AfterLine />
			</div>
		)
	}
}
