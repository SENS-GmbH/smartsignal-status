import React, { Component } from 'react'

import { Context } from '../../shared/context'

import defaultValues from '../../shared/backend/defaultValues.json'

/**
 * React component for a footer section.
 * @component
 * @example
 * <Footer />
 */
export default class Footer extends Component {
	/**
	 * @property {Function} t - The translation function.
	 */
	static contextType = Context

	render() {
		return (
			<>
				<div className="w-full h-[1px] bg-black my-2"></div>
				<div className="flex justify-between">
					<div>
						<span className="mr-1">version:</span>
						{defaultValues.version}
					</div>
					<div>
						<span className="mr-1">©</span>
						{new Date(Date.now()).getFullYear()}
						<a
							className="underline ml-1"
							href="https://sens.at/impressum"
						>
							{this.context.t('all.imprint')}
						</a>
					</div>
				</div>
			</>
		)
	}
}
