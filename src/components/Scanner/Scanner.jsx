import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { BrowserMultiFormatReader } from '@zxing/library'

export default class Scanner extends Component {
	state = {
		code: null,
		devices: null,
		selectedDeviceId: null,
		videoElement: null,
		constraints: null,
	}

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
		this.state.videoElement.pause()
		console.log('Change Device', id, this.state.videoElement)
		this.setState({ selectedDeviceId: id })
		this.setState({
			constraints: {
				audio: false,
				video: {
					deviceId: id,
				},
			},
		})
	}

	componentDidUpdate = () => {
		console.log(this.state.code)
		if (
			this.state.devices !== null &&
			this.state.videoElement !== null &&
			this.state.code === null
		) {
			const codeReader = new BrowserMultiFormatReader()
			// this.setState({ code: navigator.mediaDevices })
			// navigator.mediaDevices.getUserMedia(this.state.constraints)
			// return
			console.log(navigator)
			navigator.mediaDevices
				.getUserMedia(this.state.constraints)
				.then((stream) => {
					var myVideoElement = this.state.videoElement
					if ('srcObject' in myVideoElement) {
						myVideoElement.srcObject = stream
					} else {
						// Avoid using this in new browsers
						myVideoElement.src = window.URL.createObjectURL(stream)
					}
					myVideoElement.srcObject = stream
					console.log(
						'Video',
						myVideoElement.srcObject,
						myVideoElement.id
					)
					myVideoElement.pause()
					console.log(myVideoElement.paused)
					if (myVideoElement.paused) {
						myVideoElement.play()
					}
					codeReader.decodeFromVideoDevice(
						this.state.selectedDeviceId,
						myVideoElement.id,
						(result, error) => {
							if (result) {
								console.log(result.getText())
								this.setState({ code: result.getText() })
							}
							if (error) {
								// console.log('error1', error)
							}
						},
						this.state.constraints
					)
				})
				.catch((err) => {
					console.log('error2', err)
				})
		}
	}

	componentDidMount = () => {
		// Get VideoElement
		var myVideoElement = document.getElementById('video')
		this.setState({ videoElement: myVideoElement })

		myVideoElement.setAttribute('autoplay', '')
		myVideoElement.setAttribute('muted', '')
		myVideoElement.setAttribute('playsinline', '')

		// this.setState({
		// 	code: JSON.stringify(navigator.mediaDevices.enumerateDevices()),
		// })

		if (!this.is_iOS()) {
			// Load all Video-Devices
			navigator.mediaDevices
				.enumerateDevices()
				.then((devices) => {
					this.setState({
						devices: devices.filter(
							(device) => device.kind === 'videoinput'
						),
					})
				})
				.catch((err) => {
					this.setState({ code: '<div>' + err + '</div>' })
					console.error(
						'Error: Geräte konnten nicht geladen werden',
						err
					)
				})
			this.setState({
				constraints: {
					audio: false,
					video: {
						deviceId: this.state.selectedDeviceId,
					},
				},
			})
		} else {
			var constraints = {
				audio: false,
				video: {
					facingMode: 'user',
				},
			}
			this.setState({
				constraints: constraints,
				devices: [],
			})
			navigator.mediaDevices.getUserMedia(constraints).then((local) => {
				myVideoElement.srcObject = local
				myVideoElement.play()
			})
		}
	}

	render() {
		// if (this.state.code) {
		// 	return <Navigate to="/" />
		// }
		return (
			<div>
				{this.state.devices !== null && (
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
								{device.label}
							</option>
						))}
					</select>
				)}
				test
				<div>{this.state.code}</div>
				<video id="video" className="w-full" />
			</div>
		)
	}
}
