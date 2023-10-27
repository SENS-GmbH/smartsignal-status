// TODO: Handle Multiple Errors
// DOKU:

export const alarmColors = (color) => {
	const myColor = Number(color)
	switch (myColor) {
		case 1:
			return {
				text: 'text-emerald-500 dark:text-emerald-400 ',
				border: 'border-emerald-500 dark:border-emerald-400 ',
			}
		case 2:
			return {
				text: 'text-red-600 ',
				border: 'border-red-600 ',
			}
		case 3:
			return {
				text: 'text-yellow-400 ',
				border: 'border-yellow-400 ',
			}
		case 4:
			return {
				text: 'text-purple-500 ',
				border: 'border-purple-500 ',
			}
		case 5:
			return {
				text: 'text-orange-500 ',
				border: 'border-orange-500 ',
			}
		case 6:
			return {
				text: 'text-blue-500 ',
				border: 'border-blue-500 ',
			}
		case 7:
			return {
				text: 'text-gray-500 ',
				border: 'border-gray-500 ',
			}
		default:
			return { text: '', border: '' }
	}
}

export const alarmLogic = (t, device) => {
	var myReturn = {}
	const alarmTimestampHours = 48
	const attr = device.attributes
	var noAlarm = true
	let alarmText = []

	const userTime = new Date(new Date()).getTime()
	const inHours =
		new Date(attr.last_timestamp).getTime() +
		alarmTimestampHours * 60 * 60 * 1000
	const sinceOfflineHours =
		Math.floor((inHours - userTime) / (60 * 60 * 1000)) * -1 +
		alarmTimestampHours
	const hoursInMonth = 744

	if (device.status === 'disabled') {
		myReturn.alarm = 6
		myReturn.alarmColor = 'text-blue-500'
		if (noAlarm) {
			myReturn.setSpecialDevices = 'offline'
		}
		alarmText.push({
			color: 2,
			text: t('alarms.notActive'),
			translated: true,
		})
		noAlarm = false
	} else {
		if (attr.connected === 'False' || attr.connected === 'false') {
			myReturn.alarm = 2
			myReturn.alarmColor = 'text-red-600'
			if (noAlarm) {
				myReturn.setSpecialDevices = 'offline'
			}
			noAlarm = false
		} else if (userTime > inHours && attr.last_timestamp !== null) {
			myReturn.alarm = 2
			myReturn.alarmColor = 'text-gray-500'
			if (noAlarm) {
				myReturn.setSpecialDevices = 'offline'
			}
			if (sinceOfflineHours > hoursInMonth) {
				alarmText.push({
					color: 2,
					text: t('alarms.longOffline'),
					translated: true,
				})
			} else {
				alarmText.push({
					color: 3,
					text: t('alarms.offline', {
						hours: sinceOfflineHours,
						days: Math.floor(sinceOfflineHours / 24),
					}),
					translated: true,
				})
			}
			noAlarm = false
		} else if (
			attr.last_timestamp === '0' ||
			attr.last_timestamp === null
		) {
			myReturn.alarm = 2
			myReturn.alarmColor = 'text-gray-500'
			if (noAlarm) {
				myReturn.setSpecialDevices = 'offline'
			}
			alarmText.push({
				color: 2,
				text: t('alarms.neverSent'),
				translated: true,
			})
			noAlarm = false
		}
		if (attr.app_color === '2') {
			myReturn.alarm = 2
			myReturn.alarmColor = 'text-red-600'
			if (noAlarm) {
				myReturn.setSpecialDevices = 'alarm'
			}
			if (attr.app_alarm_text) {
				attr.app_alarm_text.forEach((alarm) => {
					alarmText.push(alarm)
				})
			}
			noAlarm = false
		}
		if (attr.app_color === '3') {
			myReturn.alarm = 3
			myReturn.alarmColor = 'text-yellow-400'
			if (attr.app_alarm_text) {
				attr.app_alarm_text.forEach((alarm) => {
					alarmText.push(alarm)
				})
			}
			if (noAlarm) {
				myReturn.setSpecialDevices = 'warning'
			}
			noAlarm = false
		}
		if (attr.app_color === '5') {
			myReturn.alarm = 4
			myReturn.alarmColor = 'text-yellow-400'
			if (attr.app_alarm_text) {
				attr.app_alarm_text.forEach((alarm) => {
					alarmText.push(alarm)
				})
			}
			if (noAlarm) {
				myReturn.setSpecialDevices = 'warning'
			}
			noAlarm = false
		}
		if (noAlarm) {
			myReturn.alarm = 1
			myReturn.alarmColor = 'text-emerald-500 dark:text-emerald-400'
			if (attr.app_alarm_text) {
				attr.app_alarm_text.forEach((alarm) => {
					alarmText.push(alarm)
				})
			}
		}
	}
	myReturn.alarmText = alarmText
	return myReturn
}
