import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons'
import React, { Component } from 'react'

export default class AlarmRow extends Component {
	// DOKU:
	showAlarm = (alarmCode) => {
		if (
			alarmCode === 0 ||
			alarmCode === 1 ||
			typeof alarmCode === 'undefined'
		) {
			return false
		}
		return true
	}

	render() {
		const { alarm, alarmText } = this.props
		return (
			<>
				{this.showAlarm(alarm) && (
					<div className="flex items-center p-1 border border-red-600 text-left border-dashed rounded-md font-bold text-red-600 mb-2">
						<div>
							<FontAwesomeIcon
								icon={faExclamationCircle}
								size="lg"
							/>
						</div>
						{/* TODO: Language ändern */}
						<p className="ml-2 hyphens-auto" lang="de">
							{alarmText}
						</p>
					</div>
				)}
			</>
		)
	}
}
