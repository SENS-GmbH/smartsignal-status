import { faImage, faEye } from '@fortawesome/free-solid-svg-icons'
// import { faImage,faEye } from '@fortawesome/pro-light-svg-icons'
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import LoadingScreen from '../../../../../shared/components/LoadingScreen'
import { Context } from '../../../../../shared/context'

// DOKU:

export default class ExtendedDevice extends Component {
	static contextType = Context
	// TODO: Gateway berücksichtigen (Und Sortierung?)

	ifNull = (value) => {
		if (value === '0' || value === null) {
			return
		} else {
			return value
		}
	}

	bar = (value, min, max, t1, t2) => {
		if (value < min || value > max || min >= max) {
			return null
		}

		const progress = ((value - min) / (max - min)) * 100

		var color
		if (value < t1) {
			color = 'red'
		} else if (value < t2) {
			color = 'yellow'
		} else {
			color = 'green'
		}

		return { progress: progress, color: color }
	}
	render() {
		const { t } = this.context
		const { device, alarm, alarmText } = this.props
		const attr = device.attributes

		return (
			<div className="text-center px-2 sm:px-8 text-sm sm:text-base mt-1 pb-4 space-y-2">
				{device.typeId !== 1 && (
					<div className="flex justify-between text-xs sm:text-base">
						<div className="w-1/3 px-2">
							<LoadingScreen.Progress
								{...this.bar(attr.rssi, -130, -30, -109, -100)}
							/>
							<div className="flex justify-between">
								<p>RSSI:</p>
								<p>{Math.round(attr.rssi)} dBm</p>
							</div>
						</div>
						<div className="w-1/3 px-2">
							<LoadingScreen.Progress
								{...this.bar(attr.snr, -30, 30, -10, 0)}
							/>
							<div className="flex justify-between">
								<p>SNR:</p>
								<p>{attr.snr} dB</p>
							</div>
						</div>
						<div className="w-1/3 px-2">
							<LoadingScreen.Progress
								{...this.bar(attr.battery, 0, 100, 25, 50)}
							/>
							<div className="flex justify-between">
								<p>{t('devices.extended.battery')}:</p>
								<p>{Math.round(attr.battery)} %</p>
							</div>
						</div>
					</div>
				)}
				<div className="font-bold">{device.serial}</div>
				<div className="flex w-full justify-between items-center">
					<div className="border border-gray-800 dark:border-gray-500 w-28 h-10 rounded-md flex items-center justify-center">
						{attr.app_status}
					</div>
					<div className="text-right truncate">
						<div className="first-letter:uppercase">
							{device.type.split('_')[1]}
						</div>
						<div>
							{new Date(attr.last_timestamp).toLocaleString(
								undefined
							)}
						</div>
					</div>
				</div>
				<div>{this.ifNull(attr.comment)}</div>
				<div className="flex justify-between">
					<NavLink to={'device/' + device.id}>
						<div className="bg-gray-100 dark:bg-gray-700 border border-gray-800 dark:border-gray-500 w-28 h-10 rounded-md flex items-center justify-center">
							<FontAwesomeIcon icon={faEye} />
							<span className="md:mb-0.5 ml-2">
								{t('devices.extended.details')}
							</span>
						</div>
					</NavLink>
					<div className="bg-gray-100 dark:bg-gray-700 border border-gray-800 dark:border-gray-500 w-28 h-10 rounded-md flex items-center justify-center">
						<FontAwesomeIcon icon={faImage} />
						<span className="md:mb-0.5 ml-2">
							{t('devices.extended.picture')}
						</span>
					</div>
				</div>
				{alarm && (
					<div className="flex items-center p-1 border border-red-600 text-left border-dashed rounded-sm font-bold text-red-600">
						<div>
							<FontAwesomeIcon
								icon={faExclamationCircle}
								size="lg"
							/>
						</div>
						<div className="ml-2">{alarmText}</div>
					</div>
				)}
			</div>
		)
	}
}
