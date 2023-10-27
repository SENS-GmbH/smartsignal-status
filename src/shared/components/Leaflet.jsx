import React, { Component } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import Context from '#context'
import { promisedSetState } from '#helper/helper.js'

// DOKU:

export default class Leaflet extends Component {
	static contextType = Context

	constructor(props) {
		super(props)
		this.mapRef = React.createRef()
		this.state = {
			noMap: true,
			map: null,
			location: [this.props.latitude, this.props.longitude]
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

	checkProps = async () => {
		await promisedSetState(this, {
			noMap: this.ifBothNull(),
		})
	}

	setMap = (map) => {
		this.setState({ map })
	}

	componentDidMount = async () => {
		await this.checkProps()
		this.setState({ location: [this.props.latitude, this.props.longitude] })
	}

	componentDidUpdate = async (prevProps) => {
		const latitude = this.props.latitude
		const longitude = this.props.longitude
		if (
			prevProps.latitude !== latitude &&
			prevProps.longitude !== longitude
		) {
			await this.checkProps()
			this.setState({ location: [latitude, longitude] })
			if (!this.ifBothNull()) {
				this.state.map.panTo([latitude, longitude])
			}
		}
	}

	render() {
		const { hr } = this.props
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

		if (sidebar) {
			return <div></div>
		}

		return (
			<div id="map" className="h-72 rounded-lg">
				<MapContainer
					className="h-72 rounded-2xl"
					center={this.state.location}
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
					<Marker position={this.state.location} />
				</MapContainer>
			</div>
		)
	}
}
