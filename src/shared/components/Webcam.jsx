import React, { Component } from 'react'
import WebcamComponent from 'react-webcam'

import Select from '#comp/Custom/Select'
import { Button } from 'flowbite-react'

import Context from '#context'
import { getMediaDevices } from '#helper/camera'

import { BrowserMultiFormatReader } from '@zxing/browser'

const ZXingBrowser = require('@zxing/browser')

// DOKU:

export class QRScanner extends Component {
	constructor(props) {
		super(props)
		this.videoRef = React.createRef()
		this.codeReader = new BrowserMultiFormatReader()
		this.controls = null
	}

	componentDidMount = async () => {
		this.controls = await this.codeReader.decodeFromVideoDevice(
			this.props.deviceid,
			this.videoRef.current,
			(result, error, controls) => {
				if (result) {
					this.props.resultScanner(result)
					controls.stop()
				}
			}
		)

		window.scrollTo(0, document.body.scrollHeight)
	}

	componentWillUnmount = () => {
		this.controls?.stop()
	}

	render() {
		return (
			<video
				autoPlay
				muted
				playsInline
				ref={this.videoRef}
				id="video"
				width={800}
				height={600}
			/>
		)
	}
}

export class Selector extends Component {
	static contextType = Context

	state = {
		videoDevices: [],
	}

	componentDidMount = async () => {
		const videoInputDevices =
			await ZXingBrowser.BrowserCodeReader.listVideoInputDevices()

		if (!(videoInputDevices.length > 1)) {
			getMediaDevices(this.context.t)
				.then((deviceInfo) => {
					this.setState({ videoDevices: deviceInfo })
				})
				.catch((error) => {
					console.error(
						'Fehler beim Abrufen der Geräteinformationen: ',
						error
					)
				})
		} else {
			this.setState({ videoDevices: videoInputDevices })
		}
	}

	// FUTURE: Torch einbauen!

	render() {
		const { selectedDeviceId, startCam, startScanner, changeSelected } =
			this.props
		const { videoDevices } = this.state
		const { t } = this.context

		return (
			<div className="flex gap-2 xs:flex-row flex-col mb-2">
				<Select
					defaultValue={selectedDeviceId || 'undefined'}
					onChange={(e) => changeSelected(e.target.value)}
					name="selectCamera"
					label={t('cam.labelCamSelector')}
					className="grow"
				>
					<option value={'undefined'}>
						{t('cam.undefinedCamSelector')}
					</option>
					{videoDevices.map((device) => (
						<option key={device.deviceId} value={device.deviceId}>
							{device.label}
						</option>
					))}
				</Select>
				<div className="flex items-center flex-col xs:flex-row gap-2">
					<Button
						className="w-full xs:w-auto"
						disabled={selectedDeviceId === 'undefined'}
						onClick={startScanner.bind(this)}
					>
						{startCam ? t('cam.stopCam') : t('cam.startCam')}
					</Button>
					{/* <Button
							className="w-full sm:w-auto opacity-50"
							onClick={() => checkToast(this.context.t, 10004)}
						>
							{t('cam.startTorch')}
						</Button> */}
				</div>
			</div>
		)
	}
}

export default class Webcam extends Component {
	constructor(props) {
		super(props)
		this.webcamRef = React.createRef()
	}

	setRef = (webcam) => {
		this.webcamRef = webcam
	}

	captureImage = () => {
		const imageSrc = this.webcamRef.getScreenshot()

		this.props.tookImage(imageSrc)
	}
	componentDidUpdate(prevProps) {
		if (
			prevProps.takePicture !== this.props.takePicture &&
			this.props.takePicture === true
		) {
			this.captureImage()
		}
	}

	render() {
		return (
			<WebcamComponent
				videoConstraints={{ deviceId: this.props.deviceId }}
				muted
				width={640}
				height={480}
				audio={false}
				ref={this.setRef}
				screenshotFormat="image/jpeg"
			/>
		)
	}
}
