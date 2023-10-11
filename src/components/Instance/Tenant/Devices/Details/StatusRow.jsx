import React, { Component } from 'react'

export default class StatusRow extends Component {
	appStatus = (status) => {
		if (status) {
			return status
		} else {
			return 'No status'
		}
	}
	render() {
		const { device } = this.props
		return (
			<div className="flex w-full justify-between items-center xxs:flex-row flex-col space-y-2 xxs:space-y-0 mt-2">
				<div className="border border-gray-800 dark:border-gray-500 w-32 h-10 rounded-md flex items-center justify-center">
					{this.appStatus(device.attributes.app_status)}
				</div>
				<div className="xxs:text-right text-center truncate text-sm">
					<div className="first-letter:uppercase">
						{device.type.split('_')[1]}
					</div>
					<div>
						{new Date(
							device.attributes.last_timestamp
						).toLocaleString(undefined)}
					</div>
				</div>
			</div>
		)
	}
}
