import { BrowserMultiFormatReader } from '@zxing/library'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { getLS, saveLS } from '../../../../../../../shared/helper/localStorage'
import { Button } from 'flowbite-react'

// DOKU:

export default class Scanner extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			videoDevices: [],
			selectedDeviceId: getLS('selectedCamera') || null,
			code: null,
		}
		this.videoRef = React.createRef()
		this.codeReader = new BrowserMultiFormatReader()
	}

	// TODO: Error Handling, if something goes wrong (Code Helper)

	componentDidMount() {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: false })
			.then(async () => {
				var allVideoDevices = navigator.mediaDevices
					.enumerateDevices()
					.then((devices) =>
						devices.filter((d) => d.kind === 'videoinput')
					)
					.then((videoDevices) => {
						this.setState({
							videoDevices,
							selectedDeviceId: videoDevices[0]?.deviceId,
						})
						return videoDevices
					})
					.catch((err) =>
						console.error('Error getting media devices: ', err)
					)

				if (this.state.selectedDeviceId) {
					this.startScanner(allVideoDevices[0]?.deviceId)
				}
			})
			.catch((err) => {
				// this.componentDidMount()
				console.error('Error getting media devices: ', err)
			})
	}

	startScanner = (selectedDeviceId, rerender) => {
		saveLS('selectedCamera', selectedDeviceId)

		if (this.videoRef.current && this.videoRef.current.srcObject) {
			this.videoRef.current.srcObject
				.getTracks()
				.forEach((track) => track.stop())
		}

		navigator.mediaDevices
			.getUserMedia({ video: { deviceId: { exact: selectedDeviceId } } })
			.then((stream) => {
				this.setState({ selectedDeviceId })

				this.videoRef.current.srcObject = stream

				this.codeReader.reset()
				this.codeReader.decodeFromVideoDevice(
					selectedDeviceId,
					this.videoRef.current.id,
					(result) => {
						if (result) {
							this.setState({ code: result.getText() })
						}
					}
				)
			})
			.catch((err) => {
				rerender
					? console.log(err)
					: setTimeout(() => {
							console.log('rerun')
							this.startScanner(selectedDeviceId, true)
					  }, 3000)
			})
	}

	componentWillUnmount() {
		if (this.videoRef.current && this.videoRef.current.srcObject) {
			this.videoRef.current.srcObject
				.getTracks()
				.forEach((track) => track.stop())
			this.codeReader.reset()
		}
	}

	render() {
		const { videoDevices, selectedDeviceId, code } = this.state

		if (code) {
			return <Navigate to={'./' + code} />
		}

		return (
			<div>
				<label htmlFor="camera-select">Choose a camera:</label>
				<select
					className="text-black"
					id="camera-select"
					value={selectedDeviceId || undefined}
					onChange={(e) => this.startScanner(e.target.value)}
				>
					<option value={undefined}>Select a camera</option>
					{videoDevices.map((device) => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label}
						</option>
					))}
				</select>
				<video
					autoPlay
					muted
					playsInline
					ref={this.videoRef}
					id="video"
					width={800}
					height={600}
				/>
				<div className="flex">
					<Button
						onClick={() =>
							this.startScanner(videoDevices[0]?.deviceid)
						}
					>
						Restart Camera
					</Button>
				</div>
			</div>
		)
	}
}
