import React, { Component } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import Context from '#context'

// DOKU:

export default class Leaflet extends Component {
	static contextType = Context

	state = { noMap: false, loading: true }

	ifNull = (value) => {
		if (
			value === 0 ||
			value === null ||
			value === false ||
			Number.isNaN(value) ||
			typeof value === 'undefined'
		) {
			return true
		} else {
			return false
		}
	}

	componentDidMount() {
		if (
			this.ifNull(Number(this.props.latitude)) ||
			this.ifNull(Number(this.props.longitude))
		) {
			this.setState({ noMap: true })
		} else {
			this.setState({ loading: false })
		}
	}

	render() {
		const { latitude, longitude } = this.props
		const { noMap, loading } = this.state
		const { t } = this.context

		if (noMap) {
			return (
				<div>
					<hr className="mt-4" />
					<p className="mt-2">{t('devices.noMap')}</p>
				</div>
			)
		}
		return (
			<>
				{!loading && (
					<div id="map" className="h-72 rounded-lg mt-4">
						<MapContainer
							className="h-72 rounded-2xl"
							center={[latitude, longitude]}
							zoom={18}
							scrollWheelZoom={false}
						>
							<TileLayer
								url={
									'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' +
									process.env.REACT_APP_MAPBOX_APITOKEN
								}
							/>
							<Marker position={[latitude, longitude]} />
						</MapContainer>
					</div>
				)}
			</>
		)
	}
}
