import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@material-tailwind/react'
import Context from '#context'
import React, { Component } from 'react'
import {
	faEdit,
	faArrowRightArrowLeft,
	faSave,
	faCancel,
} from '@fortawesome/pro-light-svg-icons'
import { installationPlace } from '#helper/showData.js'

// DOKU:

export default class DetailsHeader extends Component {
	static contextType = Context

	render() {
		const { device, editInputs, changeEditInputs, saveInputs } = this.props
		return (
			<div className="flex justify-between mx-2 mt-2.5 mb-4 flex-col xxs:flex-row">
				<div className="flex xs:font-bold flex-col truncate xxs:w-[calc(100%-160px)] mb-2 xxs:mb-0 text-center xxs:text-left">
					<div className="truncate">
						{installationPlace(device.attributes)}
					</div>
					<div className="">{device.serial}</div>
				</div>
				{this.context.isEditor &&
					(editInputs ? (
						<div className="flex space-x-2 justify-center xxs:justify-start">
							<Button
								onClick={saveInputs.bind(this)}
								className="border-white border"
							>
								<FontAwesomeIcon size="xl" icon={faSave} />
							</Button>
							<Button
								onClick={changeEditInputs.bind(this)}
								className="border-white border"
							>
								<FontAwesomeIcon size="xl" icon={faCancel} />
							</Button>
						</div>
					) : (
						<div className="flex space-x-2 justify-center xxs:justify-start">
							<Button
								onClick={() => console.log('move')}
								className="dark:shadow-none dark:border-white dark:border shadow-smAll text-black dark:text-white"
							>
								<FontAwesomeIcon
									size="xl"
									icon={faArrowRightArrowLeft}
								/>
							</Button>
							<Button
								onClick={changeEditInputs.bind(this)}
								className="dark:shadow-none dark:border-white dark:border shadow-smAll text-black dark:text-white"
							>
								<FontAwesomeIcon size="xl" icon={faEdit} />
							</Button>
						</div>
					))}
			</div>
		)
	}
}
