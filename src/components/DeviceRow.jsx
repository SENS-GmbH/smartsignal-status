import React, { Component } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTowerBroadcast } from '@fortawesome/free-solid-svg-icons'
import { faCircleSmall, faMouseField } from '@fortawesome/pro-solid-svg-icons'

/**
 * DeviceRow
 *
 * device: Object
 */
export default class DeviceRow extends Component {
	attr = this.props.device.attributes

	lastData = (typeId) => {
		if (typeId === 1) {
			return new Date(this.attr.last_data).toLocaleString()
		}
		if (this.attr.last_timestamp === '0') return ''
		return new Date(this.attr.last_timestamp).toLocaleString()
	}

	status = (device) => {
		var size = 'h-10'
		var color = ''
		switch (device.typeId) {
			// GW
			case 1:
				color =
					device.attributes.connected === 'True'
						? 'text-green-400'
						: 'text-red-400'
				return (
					<FontAwesomeIcon
						icon={faTowerBroadcast}
						className={size + ' p-2 ' + color}
					/>
				)
			// Mouse and Rats
			case 6:
			case 7:
				switch (device.attributes.trapstate) {
					case 'Normal':
						color = 'text-green-400'
						break
					case 'Failed':
						color = 'text-yellow-400'
						break
					case 'Trapped':
						color = 'text-red-400'
						break
					case '0':
					case '':
						color = 'text-gray-400'
						break
					default:
						color = 'text-purple-400'
						break
				}
				return (
					<FontAwesomeIcon
						icon={faMouseField}
						className={size + ' p-2 ' + color}
					/>
				)
			// Temp
			case 4:
			case 9:
			case 10:
				return (
					<div className="p-2">
						{device.attributes.temperature + ' °C'}
					</div>
				)
			// Snow Load
			case 8:
				return (
					<div className="p-2">
						{device.attributes.snow_load1 + ' kg/m²'}
					</div>
				)
			// Motion
			case 5:
				switch (Number(device.attributes.motion)) {
					case 1:
						color = 'text-red-400'
						break
					case 0:
						color = 'text-green-400'
						break
					default:
						color = 'text-gray-400'
						break
				}
				return (
					<FontAwesomeIcon
						icon={faCircleSmall}
						className={size + ' p-2 pr-3 ' + color}
					/>
				)

			default:
				break
		}
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
							{this.lastData(this.props.device.typeId)}
						</div>
						{this.props.device.typeId === 1 && (
							<div className="text-sm italic truncate">
								{this.attr.mac}
							</div>
						)}
					</div>
					<div className="flex justify-center items-center">
						{this.status(this.props.device)}
					</div>
				</div>
				<hr />
			</>
		)
	}
}
