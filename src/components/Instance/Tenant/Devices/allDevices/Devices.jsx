import { faFilter } from '@fortawesome/pro-light-svg-icons'

import React, { Component, Fragment } from 'react'
import ScrollButton from '#comp/Custom/Scroll/ScrollButton'
import ScrollFooter from '#comp/Custom/Scroll/ScrollFooter'
import LoadingScreen from '#comp/LoadingScreen'
import Context from '#context'
import checkToast from '#helper/toastHandler/checkToast'
import SingleDevice from './SingleDevice'
import BottomButtons from './addDevice/BottomButtons'
import DeviceCard from '#comp/Custom/Devices/DeviceCard'
import { defaultFetch } from '#helper/Fetch API/request'

// DOKU:

export default class Devices extends Component {
	static contextType = Context

	state = {
		loading: true,
		devices: [],
		currentFilter: 'all',
		specialDevices: [],
		extended: null,
		extendedIds: [],
	}

	extendAll = (onoff, id) => {
		var myIds = this.state.extendedIds
		if (onoff === null) {
			if (this.state.extendedIds.includes(id)) {
				myIds = myIds.filter((myId) => myId !== id)
			} else {
				myIds.push(id)
			}
		} else if (onoff) {
			this.state.devices.forEach((d) => myIds.push(d.id))
		} else if (!onoff) {
			myIds = []
		}
		this.setState({ extendedIds: myIds, extended: onoff })
	}

	loadDevices = () => {
		this.setState({ devices: [], loading: true })
		this.fetchDevices(this.props.params.tenantId)
	}

	setSpecialDevices = (id, name) => {
		var array = this.state.specialDevices
		array.push({ id, name })
		this.setState({
			specialDevices: array,
		})
	}

	fetchDevices = async (tenantId) => {
		const myResp = await defaultFetch(
			`${this.context.instance.api}/Device?tenantId=${tenantId}&pageSize=100&page=0`,
			{
				method: 'GET',
				headers: { Authorization: this.context.auth.access_token },
			},
			() => checkToast(this.context.t, 13001)
		)
		if (myResp.status === 204) {
			this.setState({ devices: [], loading: false })
			return
		}
		if (myResp.error) {
			checkToast(this.context.t, 13001, myResp.error)
		}
		// TODO: Filter für mehrere Optionen ermöglichen!
		var filteredGW = myResp.devices.filter((d) => d.typeId === 1)
		var filteredIO = myResp.devices.filter((d) => d.typeId === 13)
		var noGWIO = myResp.devices
			.filter((d) => d.typeId !== 1 && d.typeId !== 2 && d.typeId !== 13)
			.sort((a, b) => {
				return a.serial - b.serial
			})

		var allDevicesIO = filteredIO.concat(noGWIO)
		var allDevices = filteredGW.concat(allDevicesIO)
		this.setState({ devices: allDevices, loading: false })
		// TODO: Vernünftige Logik auch für andere Kunden (evtl. GW abholen über Config, wie ist das bei netmore?)
	}

	isNotif = () => {
		return this.state.devices.filter((device) =>
			this.state.specialDevices
				.map((device) => {
					return device.id
				})
				.includes(device.id)
		)
	}

	isSpecial = (name) => {
		var filtered = this.state.specialDevices
			.filter((device) => device.name === name)
			.map((device) => {
				return device.id
			})

		return this.state.devices.filter((device) =>
			filtered.includes(device.id)
		)
	}

	handleFilter = (value) => {
		this.setState({ currentFilter: value, extended: null })
	}

	displayedDevices = (devices, currentFilter) => {
		switch (currentFilter) {
			case 'all':
				return devices

			case 'notif':
				return this.isNotif()

			// case 'objectType':
			// 	return devices

			case 'online':
				return devices.filter(
					(d) => !this.isSpecial('offline').includes(d)
				)

			case 'offline':
				return this.isSpecial('offline')

			default:
				return
		}
	}

	scrollButtons = (devices) => {
		return [
			{
				var: 'all',
				devices: devices,
			},
			{
				var: 'notif',
				devices: this.isNotif(),
			},
			// {
			// 	var: 'objectType',
			// 	// TODO: Open Extended Filters (ev. Modal) to select more and/or detailed filters/object types
			// 	devices: devices,
			// },
			{
				var: 'online',
				devices: devices.filter(
					(d) => !this.isSpecial('offline').includes(d)
				),
			},
			{
				var: 'offline',
				devices: this.isSpecial('offline'),
			},
		]
	}

	currentDevices = (filter, modes) => {
		return modes.find((m) => m.var === filter).devices
	}

	componentDidMount = () => {
		this.loadDevices()
	}

	render() {
		const { t } = this.context
		const { loading, currentFilter, devices } = this.state

		if (loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}

		return (
			<div className="px-0 sm:px-5 md:px-10">
				<h2 className="text-center text-xl md:text-3xl mb-2">
					{this.props.tenant.name}
				</h2>
				<hr />
				<ScrollFooter icon={faFilter}>
					{this.scrollButtons(devices).map((btn) => (
						<Fragment key={btn.var + '_Buttons_' + currentFilter}>
							<ScrollButton
								active={currentFilter === btn.var}
								onClick={() => this.handleFilter(btn.var)}
							>
								{`${t('devices.filter.' + btn.var)} (${
									btn.devices.length
								})`}
							</ScrollButton>
						</Fragment>
					))}
				</ScrollFooter>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
					{this.currentDevices(
						currentFilter,
						this.scrollButtons(devices)
					).map((device, i) => (
						<Fragment key={i + '_devices_' + currentFilter}>
							{this.state.extendedIds.find((id) =>
								id.includes(device.id)
							) ? (
								<div className="col-span-2 sm:col-span-3">
									<SingleDevice
										extendAll={this.extendAll}
										extended={this.state.extended}
										extendedIds={this.state.extendedIds}
										device={device}
										setSpecialDevices={
											this.setSpecialDevices
										}
									/>
								</div>
							) : (
								<div
									onClick={() =>
										this.extendAll(null, device.id)
									}
								>
									<DeviceCard
										extendAll={this.extendAll}
										extended={this.state.extended}
										device={device}
										setSpecialDevices={
											this.setSpecialDevices
										}
									/>
								</div>
							)}
						</Fragment>
					))}
				</div>
				{this.currentDevices(currentFilter, this.scrollButtons(devices))
					.length === 0 && (
					<div className="text-center mt-4">
						{t('devices.noDevicesInList')}
					</div>
				)}
				<div className="mb-20" />
				<BottomButtons
					extendAll={this.extendAll}
					loadDevices={this.loadDevices}
				/>
			</div>
		)
	}
}
