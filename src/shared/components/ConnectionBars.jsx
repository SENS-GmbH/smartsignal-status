import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Context from '../context'

import LoadingScreen from './LoadingScreen'

/**
 * React component that display Battery, RSSI and SNR values in a bar
 *
 * @component
 * @example
 * <ConnectionBars attr={attr} />
 */
export default class ConnectionBars extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Function} t
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {Object} attr - Device attributes
	 */
	static propTypes = {
		attr: PropTypes.shape({
			rssi: PropTypes.string.isRequired,
			snr: PropTypes.string.isRequired,
			battery: PropTypes.string,
		}),
	}
	static defaultProps = {
		attr: { rssi: 0, snr: 0, battery: null },
	}

	/**
	 * Calculates the progress and color based on the given value and thresholds.
	 * @param {number} value - The value to calculate progress and color for.
	 * @param {number} min - The minimum value.
	 * @param {number} max - The maximum value.
	 * @param {number} t1 - The first threshold value.
	 * @param {number} t2 - The second threshold value.
	 * @returns {Object|null} - An object containing the progress and color, or null if the value is out of range or the minimum value is greater than or equal to the maximum value.
	 */
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
		const attr = this.props.attr

		return (
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
		)
	}
}
