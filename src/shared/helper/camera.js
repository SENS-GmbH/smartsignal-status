// DOKU:

import { saveLS, removeLS } from '#helper/localStorage'
import checkToast from '#toast'

export const changeSelected = (id) => {
	if (id === 'undefined') {
		removeLS('selectedCamera')
	} else {
		saveLS('selectedCamera', id)
	}
	return { selectedDeviceId: id, startCam: false }
}

export const getMediaDevices = async (t) => {
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
			checkToast(t, 16001)
			console.error('Error when accessing devices: ', error)
		}
	} else {
		checkToast(t, 16002)
	}
}

export default getMediaDevices
