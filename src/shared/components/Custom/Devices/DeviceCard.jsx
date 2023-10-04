import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import icon from '#helper/iconFontAwesome'
import Context from '#context'
import { installationPlace } from '#helper/showData.js'

// DOKU:

export default class SingleDevice extends Component {
	static contextType = Context

	state = {
		extended: false,
		alarm: 0,
		alarmColor: 'text-emerald-800 dark:text-emerald-400',
		alarmText: 'Lorem ipsum dolor sit amet, consectetur',
		language: this.context.language,
	}

	// TODO: Handle Multiple Errors

	alarmLogic = (device) => {
		const alarmTimestampHours = 48
		const { t } = this.context
		const attr = device.attributes

		const userTime = new Date(new Date()).getTime()
		const inHours =
			new Date(attr.last_timestamp).getTime() +
			alarmTimestampHours * 60 * 60 * 1000
		if (userTime > inHours) {
			this.setState({
				alarm: 2,
				alarmColor: 'text-gray-500',
				alarmText: t('alarms.offline', {
					hours:
						Math.floor((inHours - userTime) / (60 * 60 * 1000)) *
						-1,
				}),
			})
			this.props.setSpecialDevices(device.id, 'offline')
		} else if (attr.connected === 'False' || attr.connected === 'false') {
			this.setState({
				alarm: 2,
				alarmColor: 'text-red-600',
			})
			this.props.setSpecialDevices(device.id, 'offline')
			return
		}
		if (attr.app_color === '2') {
			this.setState({
				alarm: 2,
				alarmColor: 'text-red-600',
			})
			// TODO: "mail" Fehler noch einmal überdenken... Generell das "App_status"-Konzept sollte überarbeitet werden!
			this.props.setSpecialDevices(device.id, 'mail')
			return
		}
		if (attr.app_color === '3') {
			this.setState({
				alarm: 3,
				alarmColor: 'text-yellow-400',
			})
			this.props.setSpecialDevices(device.id, 'mail')
			return
		}
		return
	}

	changeExtended = () => {
		this.setState({ extended: !this.state.extended })
		this.props.extendAll(null, this.props.device.id)
	}

	componentDidMount = () => {
		this.alarmLogic(this.props.device)
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (
			this.props.extended !== prevProps.extended &&
			this.props.extended !== null
		) {
			this.setState({ extended: this.props.extended })
		}
		if (this.context.language !== this.state.language) {
			this.setState({ language: this.context.language })
			this.alarmLogic(this.props.device)
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
						<FontAwesomeIcon
							icon={icon(device.type.split('_')[1])}
							beat={alarm >= 2}
							className={alarmColor}
							size="2x"
						/>
					</div>
					<div className="text-right">
						<div>{device.attributes.app_status}</div>
					</div>
				</div>
				<div className="h-6 w-full flex justify-between items-center">
					<div className="text-xs">
						{new Date(
							device.attributes.last_timestamp
						).toLocaleString(undefined)}
					</div>
					<FontAwesomeIcon
						icon={extended ? faAngleUp : faAngleDown}
					/>
				</div>
			</div>
		)
	}
}
