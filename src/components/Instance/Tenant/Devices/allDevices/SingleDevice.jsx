import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import ExtendedDevice from './ExtendedDevice'
import icon from '#helper/iconFontAwesome'
import Context from '#context'
import { XyzTransition } from '@animxyz/react'

// DOKU:

export default class SingleDevice extends Component {
	static contextType = Context

	state = {
		extended: false,
		alarm: false,
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

	headline = (attr) => {
		if (attr.installation_place && attr.installation_place !== '0') {
			return (
				attr.installation_place +
				(attr.installation_number ? ' ' + attr.installation_number : '')
			)
		} else {
			return attr.installation_place2
		}
	}

	changeExtended = () => {
		this.setState({ extended: !this.state.extended })
		this.props.extendAll(null)
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

	// TODO: Rufzeichen neben Icon einbauen (ev. reicht blinkend?)

	render() {
		const { extended, alarm, alarmColor, alarmText } = this.state
		const { device } = this.props

		return (
			<div className="shadow-smAll shadow-gray-300 dark:shadow-gray-700">
				<div
					onClick={this.changeExtended.bind(this)}
					className="cursor-pointer flex justify-between h-16 items-center px-4 text-2xl"
				>
					<div className="h-8 w-6 flex justify-center items-center">
						<FontAwesomeIcon
							icon={icon(device.type.split('_')[1])}
							beat={alarm >= 2}
							className={alarmColor}
						/>
					</div>
					<div className="text-base md:text-lg truncate px-4">
						{this.headline(device.attributes)}
					</div>
					<div className="h-8 w-6 flex justify-center items-center">
						<FontAwesomeIcon
							icon={extended ? faAngleUp : faAngleDown}
						/>
					</div>
				</div>
				<XyzTransition xyz="small-100% origin-top out-duration-0">
					{extended && (
						<div>
							<ExtendedDevice
								device={device}
								alarm={alarm}
								alarmText={alarmText}
							/>
						</div>
					)}
				</XyzTransition>
			</div>
		)
	}
}
