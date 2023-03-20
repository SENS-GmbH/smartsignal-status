import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

const Wrap = (props) => {
	const params = useParams()
	const locations = useLocation()

	const Element = props.routeEl

	return (
		<Element
			params={params}
			locations={locations}
			{...props}
		/>
	)
}

export default Wrap
