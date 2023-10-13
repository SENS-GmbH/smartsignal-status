import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import ExtendedDevice from './ExtendedDevice'
import icon from '#helper/iconFontAwesome'
import Context from '#context'
import { XyzTransition } from '@animxyz/react'
import { installationPlace } from '#helper/showData.js'
import { alarmLogic } from '../../../../../shared/helper/alarms'

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

	// TODO:

	alarms = (device) => {
		const myReturn = alarmLogic(this.context.t, device)
		this.setState({
			alarm: myReturn?.alarm,
			alarmColor: myReturn?.alarmColor,
			alarmText: myReturn?.alarmText,
		})
		if (myReturn.setSpecialDevices) {
			this.props.setSpecialDevices(device.id, myReturn.setSpecialDevices)
		}
	}

	changeExtended = () => {
		this.setState({ extended: !this.state.extended })
		this.alarms(this.props.device)
		this.props.extendAll(null, this.props.device.id)
	}

	componentDidMount = () => {
		this.alarms(this.props.device)
		if (this.props.extendedIds.includes(this.props.device.id)) {
			this.setState({ extended: true })
		}
	}

	componentDidUpdate = (prevProps) => {
		if (
			this.props.extended !== prevProps.extended &&
			this.props.extended !== null
		) {
			this.setState({ extended: this.props.extended })
		}
		if (this.context.language !== this.state.language) {
			this.setState({ language: this.context.language })
			this.alarms(this.props.device)
		}
	}

	render() {
		const { extended, alarm, alarmColor, alarmText } = this.state
		const { device } = this.props

		return (
			<div className="rounded-md shadow-smAll shadow-gray-300 dark:shadow-gray-700">
				<div
					onClick={this.changeExtended.bind(this)}
					className="cursor-pointer flex justify-between h-16 items-center px-4 sm:px-6 text-2xl"
				>
					<div className="h-8 w-6 flex justify-center items-center">
						{/* TODO: Mit "DeviceCard"-Componente verschönern gemeinsam */}
						{alarmColor && (
							<FontAwesomeIcon
								icon={icon(device.type.split('_')[1])}
								beat={alarm >= 2}
								className={alarmColor}
							/>
						)}
					</div>
					{installationPlace(device.attributes) !== '' && (
						<div className="text-base md:text-lg truncate px-4">
							{installationPlace(device.attributes)}
						</div>
					)}
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
