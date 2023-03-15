import React, { Component } from 'react'
import redirect from '../../shared/helper/redirect'

export default class Footer extends Component {
	render() {
		return (
			<>
				<div className="w-full h-[1px] bg-black my-2"></div>
				<div className="flex justify-between">
					{/* TODO: Funktioniert nicht bei Netlify */}
					<div>
						version:
						<span className="ml-1">
							{process.env.REACT_APP_VERSION}
						</span>
					</div>
					<div>
						©{new Date(Date.now()).getFullYear()}
						<button
							onClick={() =>
								redirect('https://sens.at/impressum')
							}
							className="ml-1 underline"
						>
							Impressum
						</button>
					</div>
				</div>
			</>
		)
	}
}
