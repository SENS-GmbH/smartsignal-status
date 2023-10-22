import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons'
import React, { Component } from 'react'
import Context from '#context'
import { alarmColors } from '#helper/alarms'

export default class AlarmRow extends Component {
	static contextType = Context
	// DOKU:
	showAlarm = (alarmCode, alarmText) => {
		if (
			alarmCode === 0 ||
			typeof alarmCode === 'undefined' ||
			alarmText === null
		) {
			return false
		}
		return true
	}

	render() {
		const { alarm, alarmText, color, translated } = this.props
		return (
			<>
				{this.showAlarm(alarm, alarmText) && (
					<div
						className={
							alarmColors(color).text +
							alarmColors(color).border +
							'flex items-center p-1 border border-dashed text-left rounded-md font-bold'
						}
					>
						<div>
							<FontAwesomeIcon
								icon={faExclamationCircle}
								size="lg"
							/>
						</div>
						<p className="ml-2 hyphens-auto" lang="de">
							{translated ? (
								<span>{alarmText}</span>
							) : (
								<span>
									{this.context.t(
										'alarms.usecases.' + alarmText
									)}
								</span>
							)}
						</p>
					</div>
				)}
			</>
		)
	}
}
