import React, { Component } from 'react'

export default class Test extends Component {
	componentDidMount = () => {
		var constraints = {
			audio: false,
			video: {
				facingMode: 'user',
			},
		}
		var myVideoElement = document.getElementById('video123')

		myVideoElement.setAttribute('autoplay', '')
		myVideoElement.setAttribute('muted', '')
		myVideoElement.setAttribute('playsinline', '')

		navigator.mediaDevices.getUserMedia(constraints).then((local) => {
			if ('srcObject' in myVideoElement) {
				myVideoElement.srcObject = local
			} else {
				// Avoid using this in new browsers
				myVideoElement.src = window.URL.createObjectURL(local)
			}
			// myVideoElement.play()
		})
	}
	render() {
		return <video id="video123" />
	}
}
