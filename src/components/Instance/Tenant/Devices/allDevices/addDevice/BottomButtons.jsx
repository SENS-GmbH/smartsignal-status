import React, { Component } from 'react'

import {
	faPlus,
	faRotateRight,
	faEllipsisVertical,
	faExpand,
	faCompress,
} from '@fortawesome/pro-regular-svg-icons'
import { NavLink } from 'react-router-dom'
import { XyzTransition } from '@animxyz/react'
import Context from '#context'
import SingleButton from '#comp/Custom/SingleBottomButton'

// DOKU:

// TODO: Allgemein verfügbar machen

export default class BottomButtons extends Component {
	static contextType = Context

	state = {
		extraOptions: false,
	}

	changeExtraOptions = () => {
		this.setState({ extraOptions: !this.state.extraOptions })
	}

	render() {
		return (
			<div className="fixed bottom-2 max-w-3xl w-full h-20 flex -mx-4 sm:-mx-9 md:-mx-14 px-4 sm:px-9 md:px-14">
				<div className="flex items-center justify-between w-full">
					<SingleButton
						onClick={() => this.props.loadDevices()}
						icon={faRotateRight}
					/>
					{this.context.isEditor && (
						<NavLink to="addDevice">
							<SingleButton icon={faPlus} />
						</NavLink>
					)}
					<div className="relative">
						<XyzTransition xyz="fade down-2">
							{this.state.extraOptions && (
								<div className="absolute bottom-20 space-y-4">
									<SingleButton
										onClick={() =>
											this.props.extendAll(true)
										}
										icon={faExpand}
									/>
									<SingleButton
										onClick={() =>
											this.props.extendAll(false)
										}
										icon={faCompress}
									/>
								</div>
							)}
						</XyzTransition>
						<SingleButton
							onClick={this.changeExtraOptions.bind(this)}
							icon={faEllipsisVertical}
						/>
					</div>
				</div>
			</div>
		)
	}
}
