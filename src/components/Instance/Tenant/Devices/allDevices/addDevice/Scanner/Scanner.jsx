// import '@zxing/browser'
import React from 'react'
import { getLS } from '#helper/localStorage'

import { changeSelected } from '#helper/camera'

import { Selector, QRScanner } from '#comp/Webcam'

// import checkToast from '#helper/toastHandler/checkToast'

// DOKU:

export default class Scanner extends React.Component {
	state = {
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

	resultScanner = (result) => {
		this.setState(
			{
				startCam: false,
			},
			() => this.props.setCode(this.extractScannedCode(result.text))
		)
	}

	render() {
		const { selectedDeviceId, startCam } = this.state

		return (
			<div>
				<Selector
					selectedDeviceId={selectedDeviceId}
					startScanner={() =>
						this.setState({
							startCam: !this.state.startCam,
						})
					}
					changeSelected={(id) => this.setState(changeSelected(id))}
					startCam={startCam}
				/>
				{startCam && (
					<QRScanner
						resultScanner={this.resultScanner}
						deviceid={selectedDeviceId}
					/>
				)}
			</div>
		)
	}
}
