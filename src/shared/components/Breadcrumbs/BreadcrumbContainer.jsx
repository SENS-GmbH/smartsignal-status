import React, { Component } from 'react'
import Breadcrumbs from './Breadcrumbs'

export default class BreadcrumbContainer extends Component {
	componentDidMount = () => {
		console.log('myProps', this.props)
	}
	render() {
		return (
			<div
				className="h-12 dark:bg-gray-700 flex items-center"
			>
				<div className="h-full w-24 flex bg-white shadow-smRight p-1.5">
					<img
						className="object-contain"
						src="https://senswww.apps.iotp.kapschcloud.net/smartsignal/logo.png"
						alt="Test-BreadCrumb"
					/>
				</div>
				<div className="text-xs h-full w-full pl-3 flex items-center shadow-smLeft overflow-x-auto">
					<Breadcrumbs />
				</div>
			</div>
		)
	}
}
