import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'

/**
 * A component that displays a "Not Found" message and triggers a state change in its parent component.
 *
 * @component
 * @example
 * <NotFound changeNotFound={handleNotFoundChange} />
 */
export default class NotFound extends Component {
	/**
	 * @typedef {Object} PropTypes
	 * @property {function} changeNotFound - change state of parent back to false
	 */
	static propTypes = {
		changeNotFound: PropTypes.func,
	}
	static defaultProps = {
		changeNotFound: () => {}, // default value for changeNotFound prop is an empty function
	}

	componentDidMount = () => {
		this.props.changeNotFound()
	}

	render() {
		// Returns a Navigate component to redirect to an empty URL.
		return <Navigate to="" replace />
	}
}
