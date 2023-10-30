import React, { Component } from 'react'

import Context from '#context'
import checkToast from '#toast'

import SingleButton from '#comp/Custom/SingleBottomButton'

import Webcam, { Selector } from '#comp/Webcam'
import { changeSelected } from '#helper/camera'
import { getLS } from '#helper/localStorage'
import { defaultFetch } from '#helper/Fetch API/request'
import { Navigate } from 'react-router-dom'
import { faCamera, faRedo, faSave } from '@fortawesome/pro-regular-svg-icons'

export default class Camera extends Component {
	static contextType = Context

	state = {
		imageData: '',
		// imageData: null,
		takePicture: false,
		startCam: false,
		selectedDeviceId: getLS('selectedCamera') || 'undefined',
		navigate: false,
	}

	triggerCamera = () => {
		this.setState({ takePicture: true })
	}

	// FUTURE: Aktuelles Bild einblenden und neues UI für "Delete Photo" schreiben.

	savePhoto = async () => {
		await defaultFetch(
			`${this.context.instance.api}/Device/${this.props.params.deviceId}/attachment`,
			{
				method: 'PUT',
				headers: {
					Authorization: this.context.auth.access_token,
					'Content-Type': 'application/json-patch+json',
				},
				body: JSON.stringify({
					contentType: 'image/jpeg',
					content: this.state.imageData,
				}),
			},
			() => checkToast(this.context.t, 13009)
		)
		// TODO: Noch nicht richtig, da beide toasts ausgegeben werden.
		checkToast(this.context.t, 13102)
		this.setState({ navigate: true })
	}

	// TODO: cam.photo.[make,redo,delete,save] delete translations

	render() {
		const { imageData, takePicture, startCam, selectedDeviceId, navigate } =
			this.state

		if (navigate) {
			return <Navigate to={'../device/' + this.props.params.deviceId} />
		}

		if (imageData === '') {
			return (
				<div className="flex justify-center flex-col">
					<Selector
						selectedDeviceId={selectedDeviceId}
						startScanner={() =>
							this.setState({
								startCam: !this.state.startCam,
							})
						}
						changeSelected={(id) =>
							this.setState(changeSelected(id))
						}
						startCam={startCam}
					/>
					{startCam && (
						<div className="flex justify-center w-full flex-col">
							<div className="fixed bottom-2 max-w-3xl w-full justify-center h-20 flex -mx-4 sm:-mx-9 md:-mx-14 px-4 sm:px-9 md:px-14 z-[9999]">
								<SingleButton
									onClick={this.triggerCamera.bind(this)}
									icon={faCamera}
								/>
							</div>

							<Webcam
								deviceId={selectedDeviceId}
								takePicture={takePicture}
								tookImage={(imageData) =>
									this.setState({
										imageData,
										takePicture: false,
									})
								}
							/>
						</div>
					)}
				</div>
			)
		} else {
			return (
				<div className="flex justify-center flex-col">
					<img
						className="rounded-lg"
						height={480}
						width={640}
						src={imageData}
						alt="image_Camera"
					/>
					<div className="fixed bottom-2 max-w-3xl w-full justify-evenly h-20 flex -mx-4 sm:-mx-9 md:-mx-14 px-4 sm:px-9 md:px-14">
						<SingleButton
							onClick={() => this.setState({ imageData: '' })}
							icon={faRedo}
						/>
						<SingleButton
							color="dark:bg-green-600 dark:hover:bg-green-700 bg-green-700 hover:bg-green-800"
							onClick={() => this.savePhoto(imageData)}
							icon={faSave}
						/>
					</div>
				</div>
			)
		}
	}
}
