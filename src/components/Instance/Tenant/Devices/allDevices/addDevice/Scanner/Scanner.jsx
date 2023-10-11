// import '@zxing/browser'
import React from 'react'
import { getLS, saveLS, removeLS } from '#helper/localStorage'
import { Button } from 'flowbite-react'

import InsideScanner from './insideScanner'
import Select from '#comp/Custom/Select'
import Context from '#context'

import checkToast from '#helper/toastHandler/checkToast'
// DOKU:

const ZXingBrowser = require('@zxing/browser')

export default class Scanner extends React.Component {
	static contextType = Context
	constructor(props) {
		super(props)
		this.state = {
			videoDevices: [],
			selectedDeviceId: getLS('selectedCamera') || 'undefined',
			code: null,
			startCam: false,
			torchActive: false,
		}
		this.track = null
	}

	extractScannedCode = (text) => {
		let DEVEUI
		if (text.startsWith('LW:D0:')) {
			// IO Box Engico
			DEVEUI = text.split(':')[3]
		} else if (text.startsWith('HTTPS://WWW.MILESIGHT-IOT.COM/')) {
			// All Milesights
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
				await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false,
				})

				const devices = await navigator.mediaDevices.enumerateDevices()
				const videoDevices = devices.filter(
					(device) => device.kind === 'videoinput'
				)

				return videoDevices
			} catch (error) {
				console.error('Fehler beim Zugriff auf Geräte: ', error)
			}
		} else {
			console.error('Ihr Browser unterstützt die Geräteerkennung nicht.')
		}
	}

	// TODO: Error Handling (keine Cam gefunden, ...) => toasts!
	// TODO: Delete console logs

	startScanner = async () => {
		this.setState({ startCam: !this.state.startCam })
	}

	resultScanner = (result) => {
		this.setState(
			{
				startCam: false,
			},
			() => {
				this.props.setCode(this.extractScannedCode(result.text))
			}
		)
	}

	changeSelected = async (id) => {
		if (id === 'undefined') {
			removeLS('selectedCamera')
		} else {
			saveLS('selectedCamera', id)
		}
		this.setState({ selectedDeviceId: id, startCam: false })
	}

	componentDidMount = async () => {
		const videoInputDevices =
			await ZXingBrowser.BrowserCodeReader.listVideoInputDevices()

		if (!(videoInputDevices.length > 1)) {
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
		} else {
			this.setState({ videoDevices: videoInputDevices })
		}
	}

	render() {
		const { videoDevices, selectedDeviceId, startCam } = this.state
		const { t } = this.context

		return (
			<div>
				<div className="flex gap-2 sm:flex-row flex-col mb-2">
					<Select
						defaultValue={selectedDeviceId || 'undefined'}
						onChange={(e) => this.changeSelected(e.target.value)}
						name="selectCamera"
						label={t('cam.labelCamSelector')}
						className="grow"
					>
						<option value={'undefined'}>
							{t('cam.undefinedCamSelector')}
						</option>
						{videoDevices.map((device) => (
							<option
								key={device.deviceId}
								value={device.deviceId}
							>
								{device.label}
							</option>
						))}
					</Select>
					<div className="flex items-center flex-col sm:flex-row gap-2">
						<Button
							className="w-full sm:w-auto"
							disabled={selectedDeviceId === 'undefined'}
							onClick={this.startScanner.bind(this)}
						>
							{startCam ? t('cam.stopCam') : t('cam.startCam')}
						</Button>
						<Button
							className="w-full sm:w-auto"
							onClick={() => checkToast(this.context.t, 10004)}
						>
							{t('cam.startTorch')}
						</Button>
					</div>
				</div>
				{this.state.startCam && (
					<InsideScanner
						resultScanner={this.resultScanner}
						deviceid={selectedDeviceId}
					/>
				)}
			</div>
		)
	}
}
