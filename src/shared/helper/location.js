const location = () => {
	var myReturn = { error: null, pos: [] }
	navigator.geolocation.getCurrentPosition(
		(pos) => {
			myReturn.pos = [pos.coords.latitude, pos.coords.longitude]
		},
		(error) => {
			if (error.code === error.PERMISSION_DENIED)
				myReturn.error = 'location.noPermission'
			else if (error.code === error.POSITION_UNAVAILABLE)
				myReturn.error = 'location.notAvailable'
			else if (error.code === error.TIMEOUT)
				myReturn.error = 'location.timeout'
		}
	)
	return myReturn
}
export default location
