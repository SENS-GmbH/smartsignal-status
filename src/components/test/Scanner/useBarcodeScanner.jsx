import { useState, useEffect } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'

const useBarcodeScanner = () => {
	const [code, setCode] = useState(null)
	const [devices, setDevices] = useState([])
	const [selectedDeviceId, setSelectedDeviceId] = useState(null)
	const [videoElement, setVideoElement] = useState(null)

	var changeDevice = () => {
		videoElement.pause()
		console.log('test', videoElement)
		setSelectedDeviceId()
	}

	useEffect(() => {
		if (!videoElement) {
			return
		}

		const codeReader = new BrowserMultiFormatReader()

		const constraints = {
			audio: false,
			video: {
				deviceId: selectedDeviceId,
			},
		}
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				videoElement.srcObject = stream
				console.log(videoElement.srcObject, videoElement.id)
				videoElement.pause()
				console.log(videoElement.paused);
				if (videoElement.paused) {
					videoElement.play()
				}
				codeReader.decodeFromVideoDevice(
					undefined,
					videoElement.id,
					(result, error) => {
						if (result) {
							setCode(result.getText())
						}
						if (error) {
							console.log('error1', error)
						}
					},
					constraints
				)
			})
			.catch((err) => {
				console.log('error2', err)
			})

		navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				setDevices(
					devices.filter((device) => device.kind === 'videoinput')
				)
			})
			.catch((err) => {
				console.log('error3', err)
			})

		return () => {
			codeReader.reset()
		}
	}, [selectedDeviceId, videoElement])

	return {
		code,
		devices,
		selectedDeviceId,
		setVideoElement,
		changeDevice,
	}
}

export default useBarcodeScanner
