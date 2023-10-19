// import '@zxing/browser'
import React from 'react'
import { getLS, saveLS, removeLS } from '#helper/localStorage'
import { Button } from 'flowbite-react'

import InsideScanner from './insideScanner'
import Select from '#comp/Custom/Select'
import Context from '#context'

import { getMediaDevices } from '#helper/camera'

// import checkToast from '#helper/toastHandler/checkToast'

const ZXingBrowser = require('@zxing/browser')

// DOKU:

export default class Scanner extends React.Component {
	static contextType = Context

	state = {
		videoDevices: [],
		selectedDeviceId: getLS('selectedCamera') || 'undefined',
		startCam: false,
		torchActive: false,
	}

	extractScannedCode = (text) => {
		let DEVEUI

		if (text.startsWith('LW:D0:')) {
			// IO Box Engico
			DEVEUI = text.split(':')[3]
		} else if (text.startsWith('HTTPS://WWW.MILESIGHT-IOT.COM/')) {
			// All Milesights
			const url = new URL(text)
			const urlParams = new URLSearchParams(url.search)
			DEVEUI = urlParams.get('SN')
		} else {
			DEVEUI = text
		}

		return DEVEUI
	}

	// TODO: Torch einbauen!

	startScanner = () => {
		this.setState({ startCam: !this.state.startCam })
	}

	resultScanner = (result) => {
		this.setState(
			{
				startCam: false,
			},
			() => this.props.setCode(this.extractScannedCode(result.text))
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

	render() {
		const { videoDevices, selectedDeviceId, startCam } = this.state
		const { t } = this.context

		return (
			<div>
				<div className="flex gap-2 xs:flex-row flex-col mb-2">
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
					<div className="flex items-center flex-col xs:flex-row gap-2">
						<Button
							className="w-full xs:w-auto"
							disabled={selectedDeviceId === 'undefined'}
							onClick={this.startScanner.bind(this)}
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
