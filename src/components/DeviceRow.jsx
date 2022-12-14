import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@material-tailwind/react'

/**
 * DeviceRow
 *
 * device: Object
 */
export default class DeviceRow extends Component {
	attr = this.props.device.attributes

	lastData = () => {
		var timestamp = this.attr.last_timestamp
		if (timestamp === '0' || timestamp === '' || timestamp === null)
			return 'nodata'
		return new Date(timestamp).toLocaleString()
	}

	additionalData = (device) => {
		if (device.typeId === 1) {
			return this.attr.mac
		}
		if (this.attr.installation_place === '0') {
			return ''
		}
		return this.attr.installation_place
	}

	status = (attr) => {
		var size = 'h-10 '
		var color = ''
		if (
			attr.app_color !== null &&
			typeof attr.app_color !== 'undefined' &&
			attr.app_status !== null
		) {
			switch (attr.app_color) {
				case '1':
					color = 'text-green-400'
					break
				case '2':
					color = 'text-red-400'
					break
				case '3':
					color = 'text-yellow-400'
					break
				case '4':
					color = 'text-purple-400'
					break
				case '5':
					color = 'text-orange-400'
					break
				default:
					color = 'text-gray-400'
					break
			}
			return (
				<Tooltip content={attr.app_status}>
					<div className="flex justify-center items-center p-2">
						<FontAwesomeIcon
							icon={faCircle}
							className={size + color}
						/>
					</div>
				</Tooltip>
			)
		} else if (
			(attr.app_color === null ||
				typeof attr.app_color === 'undefined') &&
			attr.app_status === null
		) {
			return (
				<Tooltip content="nodata">
					<div className="flex justify-center items-center p-2">
						<FontAwesomeIcon
							icon={faCircle}
							className={size + ' text-gray-400'}
						/>
					</div>
				</Tooltip>
			)
		}
		return (
			<div className="flex justify-center items-center p-2">
				{attr.app_status}
			</div>
		)
	}

	render() {
		return (
			<>
				<div className="flex justify-between w-full my-1">
					<div className="truncate">
						<div className="w-full truncate font-bold">
							{this.props.device.serial}
						</div>
						<div className="text-sm italic truncate">
							{this.lastData()}
						</div>
						<div className="text-sm italic truncate">
							{this.additionalData(this.props.device)}
						</div>
					</div>
					{this.status(this.attr)}
				</div>
				{this.attr.comment !== '0' &&
					this.attr.comment !== '' &&
					this.attr.comment !== null && (
						<div className="text-sm italic mx-6 text-center">
							{this.attr.comment}
						</div>
					)}
				<hr />
			</>
		)
	}
}
