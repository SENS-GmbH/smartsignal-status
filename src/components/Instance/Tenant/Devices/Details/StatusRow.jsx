import React, { Component } from 'react'
import Context from '#context'
import { appStatus } from '#helper/showData.js'

export default class StatusRow extends Component {
	static contextType = Context

	last_timestamp = (ts) => {
		if (ts === '0' || ts === null) {
			return ''
		}
		return new Date(ts).toLocaleString(undefined)
	}
	render() {
		const { device } = this.props
		return (
			<div className="flex w-full justify-between items-center xxs:flex-row flex-col space-y-2 xxs:space-y-0 mt-2">
				<div className="border border-gray-800 dark:border-gray-500 w-32 h-10 rounded-md flex items-center justify-center">
					{appStatus(device.attributes.app_status, this.context.t)}
				</div>
				<div className="xxs:text-right text-center truncate text-sm">
					<div className="first-letter:uppercase">
						{device.type.split('_')[1]}
					</div>
					<div>
						{this.last_timestamp(device.attributes.last_timestamp)}
					</div>
				</div>
			</div>
		)
	}
}
