import React, { Component } from 'react'
import Context from '#context'
import Webcam from '#comp/Webcam'
import { Button } from 'flowbite-react'

// TODO: Übersetzung für "Bild aufnehmen"

export default class Camera extends Component {
	static contextType = Context

	state = {
		imageData: null,
		takePicture: false,
	}

	triggerCamera = () => {
		this.setState({ takePicture: true })
	}

	savePhoto = () => {
		// TODO: Where the magic happens
	}

	// TODO: Translation

	render() {
		const { imageData, takePicture } = this.state
		return (
			<div className="flex justify-center flex-col">
				<div className="flex justify-center w-full mb-4">
					<Webcam
						takePicture={takePicture}
						tookImage={(imageData) =>
							this.setState({ imageData, takePicture: false })
						}
					/>
				</div>
				<div className="flex flex-row xxs:flex-row gap-2">
					<Button
						onClick={this.triggerCamera.bind(this)}
						className="w-full xxs:w-1/2"
					>
						Make Photo
					</Button>
					<Button
						onClick={this.savePhoto()}
						color="success"
						className="w-full xxs:w-1/2"
					>
						Save photo
					</Button>
				</div>
				{imageData && <img src={imageData} alt="image_Camera" />}
			</div>
		)
	}
}
