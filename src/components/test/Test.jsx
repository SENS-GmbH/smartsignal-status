import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import myBarcodeScanner from './useBarcodeScanner'

export default class ScannerPage extends Component {
	state = {
		redirect: false,
	}

	handleNext = () => {
		this.setState({ redirect: true })
	}

	componentDidUpdate = () => {
		this.state.setVideoElement(document.getElementById('video'))
		if (this.state.code) {
			this.setState({ redirect: true })
		}
	}

	componentDidMount() {
		const {
			code,
			devices,
			selectedDeviceId,
			setVideoElement,
			changeDevice,
		} = myBarcodeScanner()

		this.setState({
			code: code,
			devices: devices,
			selectedDeviceId: selectedDeviceId,
			setVideoElement: setVideoElement,
			changeDevice: changeDevice,
		})
	}

	render() {
		if ('test' === true) {
			return <Navigate to="/tenant/25" />
		}
		return (
			<div>
				<select
					value={this.state.selectedDeviceId}
					onChange={(event) => this.state.changeDevice(event.target.value)}
				>
					{this.state.devices.map((device) => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label}
						</option>
					))}
				</select>
				<div>{this.state.code}</div>
				<video id="video" autoPlay={false} />
				{this.state.redirect && (
					<button onClick={this.handleNext}>Next</button>
				)}
			</div>
		)
	}
}