import React, { Component } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

export default class insideScanner extends Component {
	constructor(props) {
		super(props)
		this.videoRef = React.createRef()
		this.codeReader = new BrowserMultiFormatReader()
		this.controls = null
	}

	componentDidMount = async () => {
		this.controls = await this.codeReader.decodeFromVideoDevice(
			this.props.deviceid,
			this.videoRef.current,
			(result, error, controls) => {
				if (result) {
					this.props.resultScanner(result)
					controls.stop()
				}
			}
		)

		window.scrollTo(0, document.body.scrollHeight)
	}

	componentWillUnmount = () => {
		this.controls?.stop()
	}

	render() {
		return (
			<video
				autoPlay
				muted
				playsInline
				ref={this.videoRef}
				id="video"
				width={800}
				height={600}
			/>
		)
	}
}
