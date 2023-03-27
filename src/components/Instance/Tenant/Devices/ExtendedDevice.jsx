import { faImage, faEye } from '@fortawesome/free-solid-svg-icons'
// import { faImage,faEye } from '@fortawesome/pro-light-svg-icons'
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import LoadingScreen from '../../../../shared/components/LoadingScreen'

export default class ExtendedDevice extends Component {
	// TODO: Gateway berücksichtigen (Und Sortierung?)

	attr = this.props.device.attributes

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
		return (
			<div className="text-center px-2 sm:px-8 text-sm sm:text-base mt-1 pb-4 space-y-2">
				{this.props.device.typeId !== 1 && (
					<div className="flex justify-between text-xs sm:text-base">
						<div className="w-1/3 px-2">
							<LoadingScreen.Progress
								{...this.bar(
									this.attr.rssi,
									-130,
									-30,
									-109,
									-100
								)}
							/>
							<div className="flex justify-between">
								<p>RSSI:</p>
								<p>{Math.round(this.attr.rssi)} dBm</p>
							</div>
						</div>
						<div className="w-1/3 px-2">
							<LoadingScreen.Progress
								{...this.bar(this.attr.snr, -30, 30, -10, 0)}
							/>
							<div className="flex justify-between">
								<p>SNR:</p>
								<p>{this.attr.snr} dB</p>
							</div>
						</div>
						<div className="w-1/3 px-2">
							<LoadingScreen.Progress
								{...this.bar(this.attr.battery, 0, 100, 25, 50)}
							/>
							<div className="flex justify-between">
								<p>Batterie:</p>
								<p>{Math.round(this.attr.battery)} %</p>
							</div>
						</div>
					</div>
				)}
				<div className="font-bold">{this.props.device.serial}</div>
				<div className="flex w-full justify-between items-center">
					<div className="border border-gray-800 dark:border-gray-500 w-28 h-10 rounded-md flex items-center justify-center">
						{this.attr.app_status}
					</div>
					<div className="text-right truncate">
						<div className="first-letter:uppercase">
							{this.props.device.type.split('_')[1]}
						</div>
						<div>
							{new Date(this.attr.last_timestamp).toLocaleString(
								undefined
							)}
						</div>
					</div>
				</div>
				<div>{this.attr.comment}</div>
				<div className="flex justify-between">
					<NavLink to={'device/' + this.props.device.id}>
						<div className="bg-gray-100 dark:bg-gray-700 border border-gray-800 dark:border-gray-500 w-28 h-10 rounded-md flex items-center justify-center">
							<FontAwesomeIcon icon={faEye} />
							<span className="md:mb-0.5 ml-2">Details</span>
						</div>
					</NavLink>
					<div className="bg-gray-100 dark:bg-gray-700 border border-gray-800 dark:border-gray-500 w-28 h-10 rounded-md flex items-center justify-center">
						<FontAwesomeIcon icon={faImage} />
						<span className="md:mb-0.5 ml-2">Foto</span>
					</div>
				</div>
				{this.props.alarm && (
					<div className="flex items-center p-1 border border-red-600 text-left border-dashed rounded-sm font-bold text-red-600">
						<div>
							<FontAwesomeIcon
								icon={faExclamationCircle}
								size="lg"
							/>
						</div>
						<div className="ml-2">
							Temperatur von 55°C wurde unterschritten!
						</div>
					</div>
				)}
			</div>
		)
	}
}
