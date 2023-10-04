import React, { Component } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import Context from '#context'

// DOKU:

export default class Leaflet extends Component {
	static contextType = Context

	state = { noMap: false }

	ifNull = (value) => {
		if (value === 0 || value === null || value === false) {
			return true
		} else {
			return false
		}
	}

	componentDidMount() {
		if (
			(this.ifNull(Number(this.props.latitude)),
			this.ifNull(Number(this.props.longitude)))
		) {
			this.setState({ noMap: true })
		}
	}

	render() {
		if (this.state.noMap) {
			return <div>{this.context.t('devices.noMap')}</div>
		}
		return (
			<div id="map" className="h-72 rounded-lg">
				<MapContainer
					className="h-72 rounded-2xl"
					center={[this.props.latitude, this.props.longitude]}
					zoom={18}
					scrollWheelZoom={false}
				>
					<TileLayer
						url={
							'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' +
							process.env.REACT_APP_MAPBOX_APITOKEN
						}
					/>
					<Marker
						position={[this.props.latitude, this.props.longitude]}
					/>
				</MapContainer>
			</div>
		)
	}
}
