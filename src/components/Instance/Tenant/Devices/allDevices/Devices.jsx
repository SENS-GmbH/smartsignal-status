import { faFilter } from '@fortawesome/pro-light-svg-icons'
import { faPlus, faRotateRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ScrollButton from '../../../../../shared/components/Custom/Scroll/ScrollButton'
import ScrollFooter from '../../../../../shared/components/Custom/Scroll/ScrollFooter'
import LoadingScreen from '../../../../../shared/components/LoadingScreen'
import { Context } from '../../../../../shared/context'
import checkToast from '../../../../../shared/helper/toastHandler/checkToast'
import SingleDevice from './SingleDevice'

export default class Devices extends Component {
	static contextType = Context

	state = {
		loading: true,
		devices: [],
	}

	loadDevices = () => {
		this.setState({ devices: [], loading: true })
		this.fetchDevices(this.props.params.tenantId)
	}

	fetchDevices = (tenantId) => {
		// TODO: Paging? (auch bei Tenant)
		fetch(
			`${this.context.instance.api}/Device?tenantId=${tenantId}&pageSize=100&page=0`,
			{
				method: 'GET',
				headers: { Authorization: this.context.auth.access_token },
			}
		)
			.then((response) => response.json())
			.then((data) => {
				// TODO: Vernünftige Logik auch für andere Kunden (evtl. GW abholen über Config, wie ist das bei netmore?)
				if (data.error) throw data
				var filteredGW = data.devices.filter((d) => d.typeId === 1)
				var noGW = data.devices
					.filter((d) => d.typeId !== 1 && d.typeId !== 2)
					.sort((a, b) => {
						return a.serial - b.serial
					})

				var allDevices = filteredGW.concat(noGW)
				this.setState({ devices: allDevices, loading: false })
			})
			.catch((err) => {
				checkToast(13001, err)
			})
	}

	componentDidMount = () => {
		this.loadDevices()
	}

	render() {
		if (this.state.loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}
		return (
			<div className="px-0 sm:px-5 md:px-10">
				<h2 className="text-center text-xl md:text-3xl mb-2">
					{this.props.tenant.name}
				</h2>
				<hr />
				<ScrollFooter icon={faFilter}>
					{/* TODO: Logik für Filterungen schreiben */}
					{/* TODO: Übersetzung richtig machen */}
					<ScrollButton active>
						Alle Geräte ({this.state.devices.length})
					</ScrollButton>
					<ScrollButton>Notifizierungen (1)</ScrollButton>
					<ScrollButton>Gerätetyp</ScrollButton>
					<ScrollButton>online (10)</ScrollButton>
					<ScrollButton>offline (1)</ScrollButton>
				</ScrollFooter>
				<div>
					{this.state.devices.map((device) => (
						<Fragment key={device.id}>
							<SingleDevice device={device} />
						</Fragment>
					))}
				</div>
				<div className="mb-20" />
				{/* TODO: vernünftiges (responsive) Design überlegen */}
				<div className="fixed bottom-2 max-w-3xl w-full h-20 flex -mx-4 sm:-mx-9 md:-mx-14 px-4 sm:px-9 md:px-14">
					<div className="flex items-center justify-between w-full">
						<div
							onClick={this.loadDevices.bind(this)}
							className="cursor-pointer shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-test dark:bg-primary flex items-center justify-center"
						>
							<FontAwesomeIcon icon={faRotateRight} size="2xl" />
						</div>
						{this.context.isEditor && (
							<NavLink to="addDevice">
								<div className="shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-test dark:bg-primary flex items-center justify-center">
									<FontAwesomeIcon icon={faPlus} size="2xl" />
								</div>
							</NavLink>
						)}
					</div>
				</div>
			</div>
		)
	}
}
