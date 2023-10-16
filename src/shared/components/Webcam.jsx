import React, { Component } from 'react'
import Webcam from 'react-webcam'

class WebcamCapture extends Component {
	constructor() {
		super()
		this.state = {
			imageData: null,
		}
		this.webcamRef = React.createRef()
	}

	setRef = (webcam) => {
		this.webcamRef = webcam
	}

	captureImage = () => {
		const imageSrc = this.webcamRef.getScreenshot()

		this.setState({ imageData: imageSrc })

		this.props.tookImage(imageSrc)
	}

	render() {
		return (
			<div>
				<Webcam
					audio={false}
					ref={this.setRef}
					screenshotFormat="image/jpeg"
				/>
				<button onClick={this.captureImage}>Bild aufnehmen</button>
				{this.state.imageData && (
					<img src={this.state.imageData} alt="" />
				)}
			</div>
		)
	}
}

export default WebcamCapture
