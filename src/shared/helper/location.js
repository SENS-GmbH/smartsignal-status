const location = () => {
	var myReturn = { error: null, pos: [] }
	const myProm = new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				myReturn.pos = [pos.coords.latitude, pos.coords.longitude]
				resolve(myReturn)
			},
			(error) => {
				if (error.code === error.PERMISSION_DENIED)
					myReturn.error = 'location.noPermission'
				else if (error.code === error.POSITION_UNAVAILABLE)
					myReturn.error = 'location.notAvailable'
				else if (error.code === error.TIMEOUT)
					myReturn.error = 'location.timeout'
				reject(myReturn)
			}
		)
	})
	return myProm
}
export default location
