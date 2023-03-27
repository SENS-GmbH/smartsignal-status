import { faFilter } from '@fortawesome/pro-light-svg-icons'
import { faPlus, faRotateRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import LoadingScreen from '../../../../shared/components/LoadingScreen'
import { Context } from '../../../../shared/context'
import checkError from '../../../../shared/helper/checkError'
import SingleDevice from './SingleDevice'

export default class Devices extends Component {
	static contextType = Context

	state = {
		loading: true,
		devices: [],
	}

	reloadDevices = () => {
		this.setState({ devices: null, loading: true })
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
				checkError(err.error_description)
			})
	}

	componentDidMount = () => {
		this.fetchDevices(this.props.params.tenantId)
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
				<div className="flex overflow-x-auto space-x-2 mt-2.5 text-sm items-center pb-2">
					{/* TODO: Logik für Filterungen schreiben */}
					{/* TODO: Übersetzung richtig machen */}
					<div className="border border-transparent py-1 px-1 min-w-fit">
						<FontAwesomeIcon icon={faFilter} size="lg" />
					</div>
					<div className="border dark:border-gray-600 py-1 px-2 rounded-md min-w-fit bg-gray-200 dark:bg-gray-700">
						Alle Geräte ({this.state.devices.length})
					</div>
					<div className="border dark:border-gray-600 py-1 px-2 rounded-md min-w-fit">
						Notifizierungen (1)
					</div>
					<div className="border dark:border-gray-600 py-1 px-2 rounded-md min-w-fit">
						Gerätetyp
					</div>
					<div className="border dark:border-gray-600 py-1 px-2 rounded-md min-w-fit">
						online (10)
					</div>
					<div className="border dark:border-gray-600 py-1 px-2 rounded-md min-w-fit">
						offline (1)
					</div>
				</div>
				<div className="mt-0.5">
					{this.state.devices.map((device) => (
						<Fragment key={device.id}>
							<SingleDevice device={device} />
						</Fragment>
					))}
				</div>
				<div className="mb-20" />
				{/* TODO: vernünftiges (responsive) Design überlegen */}
				<div
					onClick={() => this.reloadDevices()}
					className="cursor-pointer fixed right-4 sm:right-6 md:absolute md:translate-x-1/3 md:right-1/3 bottom-4"
				>
					<div className="shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
						<FontAwesomeIcon icon={faRotateRight} size="2xl" />
					</div>
				</div>
				{this.context.isEditor && (
					<div className="fixed left-4 sm:left-6 md:absolute md:translate-x-1/3 md:left-1/3 bottom-4">
						<NavLink to="addDevice">
							<div className="shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
								<FontAwesomeIcon icon={faPlus} size="2xl" />
							</div>
						</NavLink>
					</div>
				)}
			</div>
		)
	}
}
