import { BrowserMultiFormatReader } from '@zxing/browser'
// import '@zxing/browser'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { getLS, saveLS } from '../../../../../../../shared/helper/localStorage'
import { Button } from 'flowbite-react'

// DOKU:

const ZXingBrowser = require('@zxing/browser')

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

	extractScannedCode = (text) => {
		let DEVEUI
		if (text.startsWith('LW:D0:')) {
			DEVEUI = text.split(':')[3]
		} else if (text.startsWith('HTTPS://WWW.MILESIGHT-IOT.COM/')) {
			const urlParams = new URLSearchParams(text)
			DEVEUI = urlParams.get('SN')
		} else {
			DEVEUI = text
		}
		return DEVEUI
	}

	getMediaDevices = async () => {
		if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			try {
				// Erlaubnis des Benutzers für die Verwendung von getUserMedia anfordern
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false,
				})

				// Wenn die Erlaubnis erteilt wurde, die Geräte abfragen
				const devices = await navigator.mediaDevices.enumerateDevices()
				const videoDevices = devices.filter(
					(device) => device.kind === 'videoinput'
				)

				// Hier können Sie mit dem Stream oder den Geräten arbeiten
				return videoDevices
			} catch (error) {
				console.error('Fehler beim Zugriff auf Geräte: ', error)
			}
		} else {
			console.error('Ihr Browser unterstützt die Geräteerkennung nicht.')
		}
	}

	// Verwenden Sie die Funktion, um die Liste der Geräte zu erhalten

	// TODO: Error Handling (keine Cam gefunden, ...)

	// TODO: Firefox, Edge & Iphone funktionieren noch nicht 100%

	startScanner = async () => {
		console.log(this.state.videoDevices, this.state.selectedDeviceId)

		// this.myCodereader(previewElem)
	}

	changeSelected = async (id) => {
		const controls = await this.codeReader.decodeFromVideoDevice(
			id,
			this.videoRef.current,
			(result, error, controls) => {
				if (result) {
					this.setState({
						code: this.extractScannedCode(result.text),
					})
					controls.stop()
				}
			}
		)
		saveLS('selectedCamera', id)
		this.setState({ selectedDeviceId: id }, () => {
			// controls.stop()
			// console.log(this.state.videoDevices, this.state.selectedDeviceId)
		})
		return controls
	}

	componentDidMount = async () => {
		// const videoInputDevices =
		// 	await ZXingBrowser.BrowserCodeReader.listVideoInputDevices()

		this.getMediaDevices()
			.then((deviceInfo) => {
				this.setState({ videoDevices: deviceInfo })
			})
			.catch((error) => {
				console.error(
					'Fehler beim Abrufen der Geräteinformationen: ',
					error
				)
			})
	}

	componentWillUnmount() {
		console.log('test')
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
					onChange={(e) => this.changeSelected(e.target.value)}
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
					<Button onClick={() => this.startScanner()}>
						Restart Camera
					</Button>
				</div>
				{this.state.code}
			</div>
		)
	}
}
