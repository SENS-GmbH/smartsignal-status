import React, { Component } from 'react'
import { Context } from '../../shared/context'
import redirect from '../../shared/helper/redirect'
import defaultValues from '../../shared/backend/defaultValues.json'

export default class Footer extends Component {
	static contextType = Context
	render() {
		return (
			<>
				<div className="w-full h-[1px] bg-black my-2"></div>
				<div className="flex justify-between">
					{/* TODO: Funktioniert nicht bei Netlify */}
					<div>
						<span className="mr-1">version:</span>
						{defaultValues.version}
					</div>
					<div>
						<span className="mr-1">©</span>
						{new Date(Date.now()).getFullYear()}
						<button
							onClick={() =>
								redirect('https://sens.at/impressum')
							}
							className="ml-1 underline"
						>
							{this.context.t('all.imprint')}
						</button>
					</div>
				</div>
			</>
		)
	}
}
