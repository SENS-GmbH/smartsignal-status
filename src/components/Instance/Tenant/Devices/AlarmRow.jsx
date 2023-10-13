import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons'
import React, { Component } from 'react'
import Context from '#context'

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

	alarmColors = (color) => {
		const myColor = Number(color)
		switch (myColor) {
			case 1:
				return {
					text: 'text-emerald-500 dark:text-emerald-400 ',
					border: 'border-emerald-500 dark:border-emerald-400 ',
				}
			case 2:
				return {
					text: 'text-red-600 ',
					border: 'border-red-600 ',
				}
			case 3:
				return {
					text: 'text-yellow-400 ',
					border: 'border-yellow-400 ',
				}
			case 4:
				return {
					text: 'text-purple-500 ',
					border: 'border-purple-500 ',
				}
			case 5:
				return {
					text: 'text-orange-500 ',
					border: 'border-orange-500 ',
				}
			case 6:
				return {
					text: 'text-blue-500 ',
					border: 'border-blue-500 ',
				}
			case 7:
				return {
					text: 'text-gray-500 ',
					border: 'border-gray-500 ',
				}
			default:
				return { text: '', border: '' }
		}
	}

	render() {
		const { alarm, alarmText, color, translated } = this.props
		return (
			<>
				{this.showAlarm(alarm, alarmText) && (
					<div
						className={
							this.alarmColors(color).text +
							this.alarmColors(color).border +
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
