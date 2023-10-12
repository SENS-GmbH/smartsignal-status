import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Context from '../context'

import LoadingScreen from './LoadingScreen'

/**
 * React component that display Battery, RSSI and SNR values in a bar
 *
 * @component
 * @example
 * <ConnectionBars device={device} />
 */
export default class ConnectionBars extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Function} t
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {Object} device - Single Device
	 */
	static propTypes = {
		device: PropTypes.shape({
			attributes: PropTypes.shape({
				rssi: PropTypes.string,
				snr: PropTypes.string,
				battery: PropTypes.string,
			}),
			typeId: PropTypes.string,
		}),
	}
	static defaultProps = {
		device: {
			attributes: { rssi: null, snr: null, battery: null },
			typeId: null,
		},
	}

	// DOKU:

	/**
	 * Calculates the progress and color based on the given value and thresholds.
	 * @param {number} value - The value to calculate progress and color for.
	 * @param {number} min - The minimum value.
	 * @param {number} max - The maximum value.
	 * @param {number} t1 - The first threshold value.
	 * @param {number} t2 - The second threshold value.
	 * @returns {Object|null} - An object containing the progress and color, or null if the value is out of range or the minimum value is greater than or equal to the maximum value.
	 */
	bar = (value, [min, max, t1, t2]) => {
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

	anzahlBars = (attr, allBars) => {
		let anzahl = 0
		for (const bar of allBars) {
			if (attr[bar.attr]) {
				anzahl++
			}
		}
		return anzahl
	}

	allBars = [
		{
			displayname: 'RSSI',
			attr: 'rssi',
			unit: 'dBm',
			thresholds: [-130, -10, -109, -100],
		},
		{
			displayname: 'SNR',
			attr: 'snr',
			unit: 'dB',
			thresholds: [-30, 30, -10, 0],
		},
		{
			displayname: this.context.t('devices.extended.battery'),
			attr: 'battery',
			unit: '%',
			thresholds: [0, 100, 25, 50],
		},
	]

	render() {
		const attr = this.props.device.attributes

		if (this.props.device.typeId === '1') {
			return <></>
		}

		return (
			<div className="flex justify-between text-xs sm:text-base space-x-2">
				{this.allBars.map(
					(bar) =>
						attr[bar.attr] && (
							<div
								style={{
									width:
										100 /
											this.anzahlBars(
												attr,
												this.allBars
											) +
										'%',
								}}
								key={'connectionBars_' + bar.attr}
							>
								<LoadingScreen.Progress
									{...this.bar(
										attr[bar.attr],
										bar.thresholds
									)}
								/>
								<div className="flex justify-between">
									<p>{bar.displayname}</p>
									<p>
										{Math.round(attr[bar.attr])} {bar.unit}
									</p>
								</div>
							</div>
						)
				)}
			</div>
		)
	}
}
