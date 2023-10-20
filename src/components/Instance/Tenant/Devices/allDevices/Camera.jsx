import React, { Component } from 'react'
import { Button } from 'flowbite-react'

import Context from '#context'
import checkToast from '#toast'

import Webcam, { Selector } from '#comp/Webcam'
import { changeSelected } from '#helper/camera'
import { getLS } from '#helper/localStorage'
import { defaultFetch } from '#helper/Fetch API/request'
import { Navigate } from 'react-router-dom'

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

	// TODO: Aktuelles Bild einblenden und neues UI für "Delete Photo" schreiben.

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
		// TODO: Noch nicht richtig, da beide contexts ausgegeben werden.
		checkToast(this.context.t, 13102)
		this.setState({ navigate: true })
	}

	render() {
		const { imageData, takePicture, startCam, selectedDeviceId, navigate } =
			this.state
		const { t } = this.context

		if (navigate) {
			return <Navigate to={'../device/' + this.props.params.deviceId} />
		}

		return (
			<div className="flex justify-center flex-col">
				<Selector
					selectedDeviceId={selectedDeviceId}
					startScanner={() =>
						this.setState({
							startCam: !this.state.startCam,
						})
					}
					changeSelected={(id) => this.setState(changeSelected(id))}
					startCam={startCam}
				/>
				<div className="flex flex-col xxs:flex-row gap-2">
					<Button
						onClick={this.triggerCamera.bind(this)}
						className="w-full xxs:w-1/2"
						disabled={selectedDeviceId === 'undefined' || !startCam}
					>
						{imageData === ''
							? t('cam.photo.make')
							: t('cam.photo.redo')}
					</Button>

					<Button
						onClick={() => this.savePhoto(imageData)}
						color={imageData === null ? 'failure' : 'success'}
						className="w-full xxs:w-1/2"
						disabled={
							imageData === null
								? false
								: imageData === '' ||
								  selectedDeviceId === 'undefined' ||
								  !startCam
						}
					>
						{imageData === null
							? t('cam.photo.delete')
							: t('cam.photo.save')}
					</Button>
				</div>
				{startCam && (
					<div className="flex justify-center w-full my-4">
						<Webcam
							deviceId={selectedDeviceId}
							takePicture={takePicture}
							tookImage={(imageData) =>
								this.setState({ imageData, takePicture: false })
							}
						/>
					</div>
				)}

				{imageData && (
					<div className="flex justify-center w-full my-4">
						<img
							height={480}
							width={640}
							src={imageData}
							alt="image_Camera"
						/>
					</div>
				)}
			</div>
		)
	}
}
