import { faAngleDown, faAngleUp, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import ExtendedDevice from './ExtendedDevice'

export default class SingleDevice extends Component {
	state = {
		extended: false,
		alarm: true,
	}
	// TODO: Rufzeichen neben Icon einbauen
	// TODO: Icon-Logik einbauen
	render() {
		return (
			<div className="shadow-smAll shadow-gray-300 dark:shadow-gray-700">
				<div
					onClick={() =>
						this.setState({ extended: !this.state.extended })
					}
					className="cursor-pointer flex justify-between h-16 items-center px-4 text-2xl"
				>
					<div><FontAwesomeIcon icon={faCircle} /></div>
					<div className="text-base md:text-lg truncate px-4">
						{this.props.device.attributes.installation_place}
					</div>
					<div>
						<FontAwesomeIcon
							icon={this.state.extended ? faAngleUp : faAngleDown}
						/>
					</div>
				</div>
				{this.state.extended && <ExtendedDevice {...this.props} alarm={this.state.alarm} />}
			</div>
		)
	}
}
