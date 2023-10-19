import React, { Component } from 'react'
import WebcamComponent from 'react-webcam'

// DOKU:

export default class Webcam extends Component {

	constructor(props) {
		super(props)
		this.webcamRef = React.createRef()
	}

	setRef = (webcam) => {
		this.webcamRef = webcam
	}

	captureImage = () => {
		const imageSrc = this.webcamRef.getScreenshot()

		this.props.tookImage(imageSrc)
	}
	componentDidUpdate(prevProps) {
		if (
			prevProps.takePicture !== this.props.takePicture &&
			this.props.takePicture === true
		) {
			this.captureImage()
		}
	}

	render() {
		return (
			<WebcamComponent
				muted
				width={640}
				height={480}
				audio={false}
				ref={this.setRef}
				screenshotFormat="image/jpeg"
			/>
		)
	}
}
