import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

// TODO: Richtig dokumentieren (Props inside function, ...)

/**
 * A higher-order component that extracts the route parameters and location object and passes them as props to a specified component.
 *
 * @function
 * @param {Object} props - The props object.
 * @param {Object} props.routeEl - The component to be wrapped.
 * @returns {JSX.Element} - A JSX element that renders the specified component with the extracted route parameters and location object as props.
 * @example
 * return (
 *   <Wrap routeEl={MyComponent} />
 * );
 */
const Wrap = (props) => {
	const params = useParams()
	const locations = useLocation()

	const Element = props.routeEl

	// Returns the specified component with the extracted route parameters and location object as props.
	return <Element params={params} locations={locations} {...props} />
}

export default Wrap
