import React, { Component } from 'react'

/**
 * AfterLine
 */
export default class AfterLine extends Component {
	render() {
		return (
			<div
				className={'h-[4px] z-50 -mt-[4px]'}
				style={{
					backgroundImage:
						'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg==)',
				}}
			/>
		)
	}
}
