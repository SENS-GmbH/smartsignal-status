import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import icon from '#helper/iconFontAwesome'
import Context from '#context'
import { installationPlace, appStatus } from '#helper/showData.js'
import { alarmLogic } from '#helper/alarms'

// DOKU:

export default class SingleDevice extends Component {
	static contextType = Context

	state = {
		extended: false,
		alarm: 0,
		alarmColor: null,
		alarmText: null,
		language: this.context.language,
	}

	// TODO: ev. mit "StatusRow" vereinen
	last_timestamp = (ts) => {
		if (ts === '0' || ts === null) {
			return ''
		}
		return new Date(ts).toLocaleString(undefined)
	}

	setAlarms = () => {
		const myReturn = alarmLogic(this.context.t, this.props.device)
		this.setState({
			alarm: myReturn?.alarm,
			alarmColor: myReturn?.alarmColor,
			alarmText: myReturn?.alarmText,
		})

		if (myReturn.setSpecialDevices) {
			this.props.setSpecialDevices(
				this.props.device.id,
				myReturn.setSpecialDevices
			)
		}
	}

	changeExtended = () => {
		this.setState({ extended: !this.state.extended })
		this.props.extendAll(null, this.props.device.id)
	}

	componentDidMount = () => {
		this.setAlarms()
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (
			this.props.extended !== prevProps.extended &&
			this.props.extended !== null
		) {
			this.setState({ extended: this.props.extended })
		}
		if (this.context.language !== this.state.language) {
			this.setState({
				language: this.context.language,
			})
			this.setAlarms()
		}
	}

	render() {
		const { extended, alarm, alarmColor } = this.state
		const { device } = this.props

		return (
			<div className="cursor-pointer shadow-smAll shadow-gray-300 dark:shadow-gray-700 rounded-md px-2 text-sm">
				<div className="h-6 text-center font-bold truncate py-0.5">
					{installationPlace(device.attributes)}
				</div>
				<div className="flex justify-between items-center h-8">
					<div className="flex justify-center px-1">
						{alarmColor && (
							<FontAwesomeIcon
								icon={icon(device.type.split('_')[1])}
								beat={alarm >= 2}
								className={alarmColor}
								size="2x"
							/>
						)}
					</div>
					<div className="text-right">
						<div>
							{appStatus(
								device.attributes.app_status,
								this.context.t
							)}
						</div>
					</div>
				</div>
				<div className="h-6 w-full flex justify-between items-center">
					<div className="text-xs">
						{this.last_timestamp(device.attributes.last_timestamp)}
					</div>
					<FontAwesomeIcon
						icon={extended ? faAngleUp : faAngleDown}
					/>
				</div>
			</div>
		)
	}
}
