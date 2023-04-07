import { BrowserMultiFormatReader } from '@zxing/library'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { getLS, saveLS } from '../../shared/helper/localStorage'

class Test extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			videoDevices: [],
			selectedDeviceId: null,
			videoElement: null,
			code: null,
		}
		this.videoRef = React.createRef()
	}

	// TODO: Error HAndling, if something goes wrong

	codeReader = new BrowserMultiFormatReader()

	getAllDevices = async () => {
		return navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then(async (stream) => {
				return navigator.mediaDevices
					.enumerateDevices()
					.then((devices) => {
						const videoDevices = devices.filter(
							(device) => device.kind === 'videoinput'
						)
						return videoDevices
					})
			})
	}

	componentDidMount() {
		var myVideoElement = document.getElementById('video')
		this.setState({ videoElement: myVideoElement })

		this.getAllDevices()
			.then((devices) => {
				this.setState({
					videoDevices: devices,
				})
				const myCamera = getLS('selectedCamera') || null
				if (myCamera) {
					this.startScanner(myCamera)
				}
			})
			.catch((err) => console.error('Error getting media devices: ', err))
	}

	startScanner = (selectedDeviceId) => {
		saveLS('selectedCamera', selectedDeviceId)
		const videoElement = this.videoRef.current
		const constraints = {
			deviceId: { exact: selectedDeviceId },
		}

		// Stopp the active video source
		if (videoElement.srcObject) {
			const stream = videoElement.srcObject
			const tracks = stream.getTracks()
			tracks.forEach(function (track) {
				track.stop()
			})
			videoElement.srcObject = null
		}

		navigator.mediaDevices
			.getUserMedia({ video: constraints })
			.then((stream) => {
				this.setState({ selectedDeviceId: selectedDeviceId })

				videoElement.srcObject = stream

				this.codeReader.reset()
				this.codeReader.decodeFromVideoDevice(
					selectedDeviceId,
					videoElement.id,
					(result) => {
						console.log('working')
						if (result) {
							var myResult = result.getText()
							this.setState({ code: myResult })
						}
					},
					constraints
				)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	componentWillUnmount = () => {
		const constraints = {
			deviceId: { exact: this.state.selectedDeviceId },
		}
		navigator.mediaDevices
			.getUserMedia({ video: constraints })
			.then((stream) => {
				var tracks = stream.getTracks()
				tracks[0].stop()
				this.codeReader.reset()
			})
			.catch((error) => {
				console.log(error)
			})
	}

	render() {
		const { videoDevices, selectedDeviceId } = this.state
		if (this.state.code) {
			return <Navigate to="/test/success" />
		}
		return (
			<div>
				<label htmlFor="camera-select">Choose a camera:</label>
				<select
					className="text-black"
					id="camera-select"
					value={selectedDeviceId}
					onChange={(e) => this.startScanner(e.target.value)}
				>
					<option value={null}>Select a camera</option>
					{videoDevices.map((device) => (
						<option key={device.deviceId} value={device.deviceId}>
							{/* <option key={device.id} value={device.id}> */}
							{device.label}
						</option>
					))}
				</select>
				<video
					autoPlay={true}
					muted={true}
					playsInline={true}
					ref={this.videoRef}
					id="video"
				/>
			</div>
		)
	}
}

export default Test
