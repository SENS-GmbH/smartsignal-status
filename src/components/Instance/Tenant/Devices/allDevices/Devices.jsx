import { faFilter } from '@fortawesome/pro-light-svg-icons'
import {
	faPlus,
	faRotateRight,
	faEllipsisVertical,
	faExpand,
	faCompress,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import ScrollButton from '#comp/Custom/Scroll/ScrollButton'
import ScrollFooter from '#comp/Custom/Scroll/ScrollFooter'
import LoadingScreen from '#comp/LoadingScreen'
import Context from '#context'
import checkToast from '#helper/toastHandler/checkToast'
import SingleDevice from './SingleDevice'
import { XyzTransition } from '@animxyz/react'

// DOKU:

// TODO: Controls on Bottom in eigene Komponente

export default class Devices extends Component {
	static contextType = Context

	state = {
		loading: true,
		devices: [],
		currentFilter: 'default',
		specialDevices: [],
		extended: null,
		extraOptions: false,
	}

	extendAll = (onoff) => {
		this.setState({ extended: onoff })
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

	fetchDevices = (tenantId) => {
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
				checkToast(this.context.t, 13001, err)
			})
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

	changeExtraOptions = () => {
		this.setState({ extraOptions: !this.state.extraOptions })
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
			case 'default':
				return devices

			case 'notif':
				return this.isNotif()

			case 'objectType':
				// TODO: Open Extended Filters (ev. Modal) to select more and/or detailed filters/object types
				return devices

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
					<ScrollButton
						active={currentFilter === 'default'}
						onClick={() => this.handleFilter('default')}
					>
						{t('devices.filter.all')} ({devices.length})
					</ScrollButton>
					<ScrollButton
						active={currentFilter === 'notif'}
						onClick={() => this.handleFilter('notif')}
					>
						{t('devices.filter.notif')} ({this.isNotif().length})
					</ScrollButton>
					<ScrollButton
						active={currentFilter === 'objectType'}
						onClick={() => this.handleFilter('objectType')}
					>
						{t('devices.filter.objectType')}
					</ScrollButton>
					<ScrollButton
						active={currentFilter === 'online'}
						onClick={() => this.handleFilter('online')}
					>
						{t('devices.filter.online')} (
						{devices.length - this.isSpecial('offline').length})
					</ScrollButton>
					<ScrollButton
						active={currentFilter === 'offline'}
						onClick={() => this.handleFilter('offline')}
					>
						{t('devices.filter.offline')} (
						{this.isSpecial('offline').length})
					</ScrollButton>
				</ScrollFooter>
				{this.displayedDevices(devices, currentFilter).map((device) => (
					<div key={device.id + '_' + currentFilter} className="">
						<SingleDevice
							extendAll={this.extendAll}
							extended={this.state.extended}
							device={device}
							setSpecialDevices={this.setSpecialDevices}
						/>
					</div>
				))}
				<div className="mb-20" />
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
						<div className="relative">
							<XyzTransition xyz="fade down-2">
								{this.state.extraOptions && (
									<div className="absolute bottom-20 space-y-4">
										<div
											onClick={() => this.extendAll(true)}
											className="cursor-pointer shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-test dark:bg-primary flex items-center justify-center"
										>
											<FontAwesomeIcon
												icon={faExpand}
												size="2xl"
											/>
										</div>
										<div
											onClick={() =>
												this.extendAll(false)
											}
											className="cursor-pointer shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-test dark:bg-primary flex items-center justify-center"
										>
											<FontAwesomeIcon
												icon={faCompress}
												size="2xl"
											/>
										</div>
									</div>
								)}
							</XyzTransition>
							<div
								onClick={this.changeExtraOptions.bind(this)}
								className="cursor-pointer shadow-smAll shadow-gray-500 w-16 h-16 rounded-full bg-test dark:bg-primary flex items-center justify-center"
							>
								<FontAwesomeIcon
									icon={faEllipsisVertical}
									size="2xl"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
