import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Context from '#context'

import { faImage, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ConnectionBars from '#comp/ConnectionBars'
import AlarmRow from '../AlarmRow'
import StatusRow from '../Details/StatusRow'
import checkToast from '#helper/toastHandler/checkToast'

/**
 * React component that show an extended view of data on the overview
 *
 * @component
 * @example
 * <ExtendedDevice/>
 */
export default class ExtendedDevice extends Component {
	/**
	 * @typedef {Object} Context
	 * @property {Function} t
	 */
	static contextType = Context

	/**
	 * @typedef {Object} PropTypes
	 * @property {Object} device - The device
	 * @property {Number} alarm - Number of the alarm to know, what color should be displayed.
	 * @property {Array} alarmText - The alarm text displayed at the bottom.
	 */
	static propTypes = {
		device: PropTypes.object.isRequired,
		alarm: PropTypes.number.isRequired,
		alarmText: PropTypes.array,
	}
	static defaultProps = {
		device: {},
		alarm: 0,
		alarmText: null,
	}

	// TODO: Gateway berücksichtigen (Und Sortierung?)

	/**
	 * Checks if a value is null or '0' and returns the appropriate result.
	 * @param {any} value - The value to be checked.
	 * @returns {any} - If the value is '0' or null, returns undefined. Otherwise, returns the original value.
	 */
	ifNull = (value) => {
		if (value === '0' || value === null || value === false) {
			return
		} else {
			return value
		}
	}

	render() {
		const { t } = this.context
		const { device, alarm, alarmText } = this.props

		return (
			<div className="text-center px-2 sm:px-6 pb-2 sm:pb-4 text-sm sm:text-base mt-1 space-y-2">
				<ConnectionBars device={device} />
				<div className="font-bold">{device.serial}</div>
				<StatusRow device={device} />
				<div>{this.ifNull(device.attributes.comment)}</div>
				<div className="flex justify-between">
					<NavLink to={'device/' + device.id}>
						<div className="bg-gray-100 dark:bg-gray-700 border border-gray-800 dark:border-gray-500 w-28 xxs:w-32 h-10 rounded-md flex items-center justify-center">
							<FontAwesomeIcon icon={faEye} />
							<span className="md:mb-0.5 ml-2">
								{t('devices.extended.details')}
							</span>
						</div>
					</NavLink>
					<div
						onClick={() => checkToast(this.context.t, 10004)}
						className="cursor-not-allowed bg-gray-100 dark:bg-gray-500 border border-gray-800 dark:border-gray-500 w-28 xxs:w-32 h-10 rounded-md flex items-center justify-center"
					>
						<FontAwesomeIcon icon={faImage} />
						<span className="md:mb-0.5 ml-2">
							{t('devices.extended.picture')}
						</span>
					</div>
				</div>
				{alarmText.map((text, i) => (
					<div key={i + '_AlarmRow'}>
						<AlarmRow
							alarm={alarm}
							alarmText={text.text}
							color={text.color}
							translated={text.translated}
						/>
					</div>
				))}
			</div>
		)
	}
}
