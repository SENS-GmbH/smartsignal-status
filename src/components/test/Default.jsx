import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { BrowserMultiFormatReader } from '@zxing/library'

export default class Scanner extends Component {
	state = {
		showDevices: false,
		startScanner: false,
		selectedDeviceId: false,
		code: null,
		devices: [],
		videoElement: null,
		constraints: null,
	}

	// Check Devices
	is_Opera = navigator.userAgent.match(/Opera|OPR\//) ? true : false
	is_iOS = () => {
		return (
			[
				'iPad Simulator',
				'iPhone Simulator',
				'iPod Simulator',
				'iPad',
				'iPhone',
				'iPod',
			].includes(navigator.platform) ||
			// iPad on iOS 13 detection
			(navigator.userAgent.includes('Mac') && 'ontouchend' in document)
		)
	}

	changeDevice = (id) => {
		this.stop() // TODO: Testing
		this.state.videoElement?.pause()
		this.setState({
			selectedDeviceId: id,
			startScanner: true,
			constraints: {
				audio: false,
				video: {
					deviceId: id,
				},
			},
		})
	}

	codeReader = new BrowserMultiFormatReader()

	componentDidUpdate = () => {
		if (
			this.state.devices.length > 0 &&
			this.state.videoElement !== null &&
			this.state.code === null
		) {
			console.log(this.codeReader)
			navigator.mediaDevices
				.getUserMedia(this.state.constraints)
				.then((stream) => {
					var myVideoElement = this.state.videoElement

					myVideoElement.srcObject = stream

					myVideoElement.pause()
					if (myVideoElement.paused) {
						myVideoElement.play()
					}
					this.codeReader.decodeFromVideoDevice(
						this.state.selectedDeviceId,
						myVideoElement.id,
						(result) => {
							console.log('working')
							if (result) {
								var myResult = result.getText()
								this.setState({ code: myResult })
							}
						},
						this.state.constraints
					)
				})
				.catch((err) => {
					console.log('Error start Video: ', err)
				})
		}
	}

	getAllDevices = async () => {
		if (this.is_Opera) {
			var constraints = {
				audio: false,
				video: true,
				// video: { deviceId: devices[0].deviceId },
			}

			var devices = await navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					var filtered = devices.filter(
						(device) =>
							device.kind === 'videoinput' &&
							device.deviceId !== ''
					)
					return filtered
				})
			if (devices.length > 0) {
				console.log(devices, 'inside devices')
				return devices
			} else {
				console.log('before')
				// TODO: Bug => Check Opera
				navigator.mediaDevices.getUserMedia(constraints).then((t) => {
					// Show button to restart "getAllDevices"
				})
			}
		} else if (this.is_iOS()) {
			// TODO: IOS
		} else {
			// Load all Video-Devices
			return navigator.mediaDevices
				.getUserMedia({ audio: false, video: true })
				.then(async () => {
					const devices =
						await navigator.mediaDevices.enumerateDevices()
					var filtered = devices.filter(
						(device) =>
							device.kind === 'videoinput' &&
							device.deviceId !== ''
					)
					console.log(filtered, 'filtered')
					return filtered
				})
				.catch((error) => {
					console.log('Error :', error)
				})
		}
	}

	stop = () => {
		var myVid = this.state.videoElement
		myVid.srcObject && myVid.srcObject.getTracks().forEach((t) => t.stop())
	}

	componentDidMount = () => {
		// TODO: Check if Possible to Save ID in LocalStorage

		// Get VideoElement
		var myVideoElement = document.getElementById('video')
		this.setState({ videoElement: myVideoElement })

		myVideoElement.setAttribute('autoplay', '')
		myVideoElement.setAttribute('muted', '')
		myVideoElement.setAttribute('playsinline', '')

		this.setState({
			constraints: {
				audio: false,
				video: {
					deviceId: this.state.selectedDeviceId,
				},
			},
		})
		this.saveDevices()
	}

	componentWillUnmount = () => {
		this.codeReader.stopContinuousDecode()
		this.codeReader.reset()
		this.codeReader.stopStreams()
		if (this.state.videoElement) {
			this.state.videoElement.pause()
		}
	}

	saveDevices = () => {
		this.getAllDevices()
			.then((devices) => {
				console.log('myDevices', devices)
				if (devices?.length > 0) {
					this.setState({
						devices: devices,
						// selectedDeviceId: devices[0].deviceId,
					})
				}
			})
			.catch((err) => console.error(err))
	}

	render() {
		if (this.state.code) {
			return <Navigate to="/test" />
		}
		return (
			<div>
				<button onClick={this.saveDevices.bind(this)}>Get all</button>
				{this.state.devices.length > 0 && (
					<select
						value={this.state.selectedDeviceId}
						onChange={(event) =>
							this.changeDevice(event.target.value)
						}
					>
						{this.state.devices.map((device) => (
							<option
								key={device.deviceId}
								value={device.deviceId}
							>
								<>{device.label}</>
							</option>
						))}
					</select>
				)}
				<br />
				<video id="video" className="w-full" />
			</div>
		)
	}
}
