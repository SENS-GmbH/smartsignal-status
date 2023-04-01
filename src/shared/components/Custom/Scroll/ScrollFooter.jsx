import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// TODO: Namen bearbeiten
// TODO: ev. Umbauen, dass nur ein Array übergeben wird und er das ScrollButton auch gleich übernimmt.

/**
 * React component for the Scroll Footer.
 *
 * @component
 * @example
 * <ScrollFooter
 * icon={<FontAwesomeIcon icon={faHouse} />}
 * bottomLine={false}
 * >
 * <div>Eintrag 1</div>
 * <div>Eintrag 2</div>
 * </ScrollFooter>
 */
export default class ScrollFooter extends Component {
	/**
	 * @typedef {Object} PropTypes
	 * @property {import("@fortawesome/fontawesome-svg-core").IconDefinition} [icon] - fontawesome icon object
	 * @property {boolean} [bottomLine] - flag to render a bottom line
	 * @property {ReactNode} children - react node to render within the component
	 */
	static propTypes = {
		icon: PropTypes.object,
		bottomLine: PropTypes.bool,
		children: PropTypes.node.isRequired,
	}
	static defaultProps = {
		bottomLine: true,
	}

	// TODO: Farblich schöner abstimmen.
	render() {
		const { bottomLine, icon, children } = this.props
		return (
			<>
				<div className="flex overflow-x-auto space-x-2 mt-2.5 text-sm items-center pb-2 mb-0.5">
					{icon && (
						<div className="border border-transparent py-1 px-1 min-w-fit">
							<FontAwesomeIcon icon={icon} size="lg" />
						</div>
					)}
					<div className="flex space-x-2">{children}</div>
				</div>
				{bottomLine && <hr />}
			</>
		)
	}
}
