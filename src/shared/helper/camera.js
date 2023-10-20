// DOKU:

import { saveLS, removeLS } from '#helper/localStorage'

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
			console.error('Fehler beim Zugriff auf Geräte: ', error)
		}
	} else {
		console.error('Ihr Browser unterstützt die Geräteerkennung nicht.')
	}
}

// TODO: Translate

// TODO: Error Handling (keine Cam gefunden, ...) => toasts!
// TODO: Delete console logs

export default getMediaDevices
