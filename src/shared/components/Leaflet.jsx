import React, { Component } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import Context from '#context'

// DOKU:

export default class Leaflet extends Component {
	static contextType = Context

	constructor(props) {
		super(props)
		this.mapRef = React.createRef()
		this.state = {
			noMap: true,
			map: null,
		}
	}

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

	ifBothNull = () => {
		return (
			this.ifNull(Number(this.props.latitude)) ||
			this.ifNull(Number(this.props.longitude))
		)
	}

	checkProps = () => {
		this.setState({
			noMap: this.ifBothNull(),
		})
	}

	setMap = (map) => {
		this.setState({ map })
	}

	componentDidMount() {
		this.checkProps()
	}

	componentDidUpdate(prevProps) {
		if (
			prevProps.latitude !== this.props.latitude &&
			prevProps.longitude !== this.props.longitude
		) {
			this.checkProps()
			if (!this.ifBothNull()) {
				this.state.map.panTo([
					this.props.latitude,
					this.props.longitude,
				])
			}
		}
	}

	render() {
		const { latitude, longitude, hr } = this.props
		const { noMap } = this.state
		const { t, sidebar } = this.context

		if (noMap) {
			return (
				<div>
					{hr && <hr className="mt-4" />}
					<p className="mt-2 italic">{t('devices.location.noMap')}</p>
				</div>
			)
		}

		if(sidebar) {
			return <div></div>
		}

		return (
			<div id="map" className="h-72 rounded-lg">
				<MapContainer
					className="h-72 rounded-2xl"
					center={[latitude, longitude]}
					zoom={18}
					scrollWheelZoom={false}
					ref={this.setMap}
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
		)
	}
}
