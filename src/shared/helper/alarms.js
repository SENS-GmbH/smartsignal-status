// TODO: Handle Multiple Errors
// DOKU:

export const alarmLogic = (t, device) => {
	var myReturn = {}
	const alarmTimestampHours = 48
	const attr = device.attributes

	const userTime = new Date(new Date()).getTime()
	const inHours =
		new Date(attr.last_timestamp).getTime() +
		alarmTimestampHours * 60 * 60 * 1000
	if (device.status === 'disabled') {
		myReturn.alarm = 2
		myReturn.alarmColor = 'text-blue-500'
		myReturn.alarmText = t('alarms.notActive')
		myReturn.setSpecialDevices = 'offline'
	} else if (userTime > inHours) {
		myReturn.alarm = 2
		myReturn.alarmColor = 'text-gray-500'
		myReturn.alarmText = t('alarms.offline', {
			hours: Math.floor((inHours - userTime) / (60 * 60 * 1000)) * -1,
		})
		myReturn.setSpecialDevices = 'offline'
	} else if (attr.connected === 'False' || attr.connected === 'false') {
		myReturn.alarm = 2
		myReturn.alarmColor = 'text-red-600'
		myReturn.setSpecialDevices = 'offline'
	}
	// TODO: Der Alarmtext muss unbedingt noch angepasst werden! (Multilingual)
	else if (attr.app_color === '2') {
		myReturn.alarm = 2
		myReturn.alarmColor = 'text-red-600'
		myReturn.alarmText = 'Ein Failed-Catch wurde gefunden!'
		myReturn.setSpecialDevices = 'mail'
	} else if (attr.app_color === '3') {
		myReturn.alarm = 3
		myReturn.alarmColor = 'text-yellow-400'
		myReturn.alarmText = 'Es wurde ein Tier gefangen!'
		myReturn.setSpecialDevices = 'mail'
	} else {
		myReturn.alarm = 1
		myReturn.alarmColor = 'text-emerald-500 dark:text-emerald-400'
	}
	return myReturn
}
