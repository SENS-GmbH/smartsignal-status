import {} from '@fortawesome/pro-light-svg-icons'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import {
	faWifi,
	faSnowflakes,
	faBolt,
	faMicrochip,
	faMouseField,
	faPersonWalking,
	faTemperatureThreeQuarters,
} from '@fortawesome/pro-regular-svg-icons'

// DOKU:

const icon = (devicetype) => {
	switch (devicetype) {
		// Gateway
		case 'gateway':
		case 'Gateway':
			return faWifi

		// Temperature
		case 'Milesight EM500-PT100':
		case 'Milesight EM300-TH':
		case 'Senlab TEM-LAB-14NS':
			return faTemperatureThreeQuarters

		// Mouse/Rat Traps
		case 'Xignal Mousetrap':
		case 'Xignal Rattrap':
			return faMouseField

		// Snow
		case 'Milesight UC501 Snow':
			return faSnowflakes

		// Electricity Meter
		case 'HarvyLR-36':
		case 'MCF LW12PLG':
			return faBolt

		// Motion
		case 'Xignal Motion Sensor':
			return faPersonWalking

		// IO-Boxes
		case '':
			return faMicrochip

		default:
			return faCircle
	}
}

export default icon
