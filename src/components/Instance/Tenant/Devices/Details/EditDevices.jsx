import React, { Component } from 'react'
import DetailsHeader from './DetailsHeader'
import ConnectionBars from '#comp/ConnectionBars.jsx'
import Inputs from './Inputs'

import checkToast from '#toast'
import Context from '#context'
import { defaultFetch } from '#helper/Fetch API/request'
import { getAppControlled } from '#helper/showData.js'
import { Button } from 'flowbite-react'
import Listed from './Listed'
import LoadingScreen from '#comp/LoadingScreen.jsx'
import Headline from '../../../../../shared/components/Custom/Headline'
import { promisedSetState } from '#helper/helper.js'
import ModalDefault, {
	ModalConfirm,
} from '../../../../../shared/components/Custom/Modal/Modal'
import { alarmLogic } from '../../../../../shared/helper/alarms'
import AlarmRow from '../AlarmRow'
import Toggle from '../../../../../shared/components/Custom/Toggle'
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons'
import StatusRow from './StatusRow'
import Tenant from '../../Tenant'
import { Navigate } from 'react-router-dom'
import location from '../../../../../shared/helper/location'
import Leaflet from '../../../../../shared/components/Leaflet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/pro-regular-svg-icons'
// DOKU:

// TODO: Diese Componente aufräumen!

export default class EditDevices extends Component {
	static contextType = Context

	state = {
		loading: true,
		loadingLocation: true,
		inputs: [],
		catalogue: null,
		appControlled: [],
		showModal_Prov: false,
		showModal_MoveDevice: false,
		showModal_SaveLocation: false,
		ready2Patch: null,
		isChecked: false,
		MoveChangeUrl: false,
		alarm: 0,
		alarmColor: null,
		alarmText: null,
		location: [],
		useGPS: true,
	}

	AccessToken = this.context.auth.access_token

	updateInputs = (childState) => {
		// childstate: { [name]: value }
		const entries = Object.entries(childState)
		const myState = this.state.inputs
		const allOthers = myState.filter((i) => i.name !== entries[0][0])
		const finds = myState.find((i) => i.name === entries[0][0])
		allOthers.push({
			name: finds.name,
			value: entries[0][1],
			displayname: finds.displayname,
			catalogue: finds.catalogue,
		})
		this.setState({ inputs: allOthers })
	}

	finalRequest = async (allInputs, camera) => {
		this.setState({
			showModal_SaveLocation: false,
		})

		if (this.state.useGPS) {
			allInputs.latitude = this.state.location[0].toString()
			allInputs.longitude = this.state.location[1].toString()
		} else {
			allInputs.latitude = this.props.device.attributes.latitude
			allInputs.longitude = this.props.device.attributes.longitude
		}

		const updatedAttributes = await defaultFetch(
			`${this.context.instance.api}/Device/${this.props.device.id}`,
			{
				method: 'PATCH',
				headers: {
					Authorization: this.AccessToken,
					'Content-Type': 'application/json-patch+json',
				},
				body: JSON.stringify(allInputs),
			},
			() => checkToast(this.context.t, 15003)
		)

		checkToast(
			this.context.t,
			updatedAttributes.isUpdated ? 15101 : 15002,
			updatedAttributes
		)

		if (camera) {
			await promisedSetState(this, { makePhoto: true })
		}

		this.reloadPage()
	}

	reloadPage = async () => {
		const oneDevice = await this.props.parentLoadDevice()
		this.setState({ loading: true, ready2Patch: null })
		this.props.changeEditInputs(false)
		await this.initLoad(oneDevice)
	}

	saveInputs = async () => {
		let allInputs = {}

		const mappedAppControlled = this.state.appControlled.map((input) => {
			return {
				[input.name]: this.state.inputs.find(
					(i) => i.displayname === input.displayname
				),
			}
		})

		mappedAppControlled.forEach((item) => {
			for (const key in item) {
				if (item.hasOwnProperty(key)) {
					allInputs[key] =
						item[key].value === '' ? null : item[key].value
				}
			}
		})

		if (
			allInputs.installation_place === '0' ||
			allInputs.installation_place === null ||
			(allInputs.installation_place === 'Sonstiges' &&
				allInputs.installation_place2 === null)
		) {
			checkToast(this.context.t, 15003)
			return
		}

		// TODO: IMPORTANT: Logilk für spar_installation_place hinzufügen!

		if (
			allInputs.installation_place !== 'Sonstiges' &&
			allInputs.installation_number === null
		) {
			allInputs.installation_number = 1
		}

		allInputs.move_to_tenant = this.props.newTenantId

		this.setState({ ready2Patch: allInputs, showModal_SaveLocation: true })
	}

	initLoad = async (oneDevice) => {
		this.alarms(oneDevice)
		const catalogue = await defaultFetch(
			`${this.context.instance.api}/Catalogue/data?tenantId=${oneDevice.tenantId}&pageSize=50000`,
			{
				method: 'GET',
				headers: {
					Authorization: this.AccessToken,
				},
			},
			() => checkToast(this.context.t, 13005)
		)

		const oneDeviceType = await defaultFetch(
			`${this.context.instance.api}/DeviceType/${oneDevice.typeId}`,
			{
				method: 'GET',
				headers: { Authorization: this.AccessToken },
			},
			() => checkToast(this.context.t, 13004)
		)

		const getApp = getAppControlled(oneDeviceType, oneDevice)

		await this.useCurrentLocation()

		await promisedSetState(this, {
			appControlled: getApp.appControlled,
			inputs: getApp.inputs,
			loading: false,
			loadingLocation: false,
			catalogue,
			isChecked: this.props.device.status === 'enabled',
		})
		return
	}

	myNetmoreProvision = async (id, prov) => {
		const netmore_url = 'https://api.blink.services/rest'
		const myTokenResp = await defaultFetch(
			netmore_url +
				'/core/login/' +
				process.env.REACT_APP_NETMORE_USERNAME,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					password: process.env.REACT_APP_NETMORE_PASSWORD,
				}),
			},
			() => checkToast(this.context.t, 11006)
		)
		if (!myTokenResp.success) {
			checkToast(this.context.t, 11006)
			return { success: false }
		}

		const myToken = myTokenResp.token

		const fetchGW = await defaultFetch(
			netmore_url + `/net/gateways/${id}`,
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + myToken,
				},
			},
			() => {
				checkToast(this.context.t, 13007)
			}
		)

		if (fetchGW.status === 400) {
			return { success: false }
		}

		await defaultFetch(
			netmore_url + `/net/gateways/${id}/${prov}`,
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + myToken,
				},
			},
			() => checkToast(this.context.t, 13007)
		)
		return { success: true }
	}

	moveDevice = async (id, device) => {
		const myIOTAResp = await defaultFetch(
			`${this.context.instance.api}/Device/${device.id}`,
			{
				method: 'PATCH',
				headers: {
					Authorization: this.AccessToken,
					'Content-Type': 'application/json-patch+json',
				},
				body: JSON.stringify({ move_to_tenant: id }),
			},
			() => checkToast(this.context.t, 15004)
		)
		if (!myIOTAResp?.isUpdated) {
			checkToast(this.context.t, 15004)
			return
		}
		checkToast(this.context.t, 15102)

		this.setState({ MoveChangeUrl: true })
	}

	alarms = (device) => {
		const myReturn = alarmLogic(this.context.t, device)
		this.setState({
			alarm: myReturn?.alarm,
			alarmColor: myReturn?.alarmColor,
			alarmText: myReturn?.alarmText,
		})
	}

	changeProvisioned = async (newState) => {
		const { device } = this.props
		if (device.typeId === 1) {
			const myNetmoreResp = await this.myNetmoreProvision(
				Math.round(device.attributes.netmore_id),
				newState ? 'provision' : 'unprovision'
			)
			if (!myNetmoreResp.success) {
				checkToast(this.context.t, 13008)
				return
			}
		}
		const myIOTAResp = await defaultFetch(
			`${this.context.instance.api}/Device/${device.id}`,
			{
				method: 'PATCH',
				headers: {
					Authorization: this.AccessToken,
					'Content-Type': 'application/json-patch+json',
				},
				body: JSON.stringify({ status: newState ? '1' : '0' }),
			},
			() => checkToast(this.context.t, 13007)
		)
		if (!myIOTAResp?.isUpdated) {
			checkToast(this.context.t, 13007)
			return
		}
		checkToast(this.context.t, 13101)

		this.reloadPage()
	}

	useCurrentLocation = async () => {
		this.setState({ loadingLocation: true, useGPS: true })
		location()
			.then((myLocation) => {
				this.setState({
					loadingLocation: false,
					location: myLocation.pos,
				})
			})
			.catch((myLocation) => {
				// TODO: Error anzeigen, wenn nicht erlaubt wird.
				this.setState({
					loadingLocation: false,
					location: [null, null],
				})
			})
	}

	componentDidMount = () => {
		this.initLoad(this.props.device)
	}

	render() {
		const { t, isEditor, instance } = this.context
		const {
			appControlled,
			catalogue,
			inputs,
			loading,
			alarm,
			alarmText,
			showModal_Prov,
			showModal_MoveDevice,
			MoveChangeUrl,
			ready2Patch,
			showModal_SaveLocation,
			location,
			useGPS,
			loadingLocation,
			makePhoto,
		} = this.state

		const { device, editInputs, title, changeEditInputs, clickDownlink } =
			this.props

		if (loading) {
			return <LoadingScreen.Spinner className="mt-4" />
		}

		if (MoveChangeUrl) {
			return <Navigate to={'..'} />
		}

		// TODO: Not an elegate way to solve that

		if (makePhoto) {
			return <Navigate to={this.props.navigatePhoto + '/camera'} />
		}

		return (
			<div className="px-0 sm:px-5 md:px-10">
				<Headline hr>{title}</Headline>
				<DetailsHeader
					device={device}
					editInputs={editInputs}
					changeEditInputs={changeEditInputs}
					saveInputs={this.saveInputs}
					moveDevice={() => {
						this.setState({ showModal_MoveDevice: true })
					}}
				/>
				<div className="mb-3 space-y-2">
					{alarmText.map((text, i) => (
						<div key={i + '_AlarmRow'}>
							<AlarmRow
								alarm={alarm}
								alarmText={text.text}
								color={text.color}
								translated={text.translated}
							/>
						</div>
					))}
				</div>

				<ConnectionBars device={device} />

				<StatusRow device={device} />

				{isEditor && (
					<Toggle
						onChange={() => this.setState({ showModal_Prov: true })}
						isChecked={this.state.isChecked}
					>
						{t('devices.provisioned.toggle')}:
					</Toggle>
				)}

				{isEditor &&
					clickDownlink &&
					instance.downlinks.io.includes(device.typeId) && (
						<div>
							<div className="mb-1">{t('devices.output')}:</div>
							<div className="flex space-x-2 mb-4">
								<Button
									className="w-1/2"
									color="success"
									onClick={() => clickDownlink(false)}
								>
									{t('all.on')}
								</Button>
								<Button
									className="w-1/2"
									color="failure"
									onClick={() => clickDownlink(true)}
								>
									{t('all.off')}
								</Button>
								<Button onClick={() => this.reloadPage()}>
									<FontAwesomeIcon
										size="xl"
										icon={faRotateRight}
									/>
								</Button>
							</div>
						</div>
					)}

				{editInputs ? (
					<div className="mt-2">
						<Inputs
							catalogue={catalogue}
							appControlled={appControlled}
							updateParent={this.updateInputs}
							inputs={inputs}
						/>
					</div>
				) : (
					<Listed
						serial={device.typeId === 1 ? device.edid : null}
						appControlled={appControlled}
					/>
				)}

				{showModal_SaveLocation && (
					<ModalConfirm
						show={showModal_SaveLocation}
						onClose={() =>
							this.setState({
								showModal_SaveLocation: false,
							})
						}
						denyModal={() => this.finalRequest(ready2Patch, false)}
						saveModal={() => this.finalRequest(ready2Patch, true)}
						buttonConfirm={t('devices.newPicture.newPicture')}
						buttonCancel={t('devices.newPicture.oldPicture')}
						header
						footer={t('devices.newPicture.question')}
					>
						<div className="text-xs">
							<AlarmRow
								alarm
								alarmText={t('devices.move.noticeDuration')}
								color="6"
								translated
							/>
						</div>
						{loadingLocation && (
							<LoadingScreen.Spinner className="mt-4" />
						)}

						{!loadingLocation && (
							<div className="mt-4">
								<Leaflet
									latitude={location[0]}
									longitude={location[1]}
								/>
								<button
									onClick={() => {
										if (useGPS) {
											this.setState({
												location: [
													device.attributes.latitude,
													device.attributes.longitude,
												],
												useGPS: false,
											})
										} else {
											this.useCurrentLocation()
										}
									}}
									className="underline w-full mt-2"
								>
									{useGPS
										? t('devices.location.useNoGPS')
										: t('devices.location.useGPS')}
								</button>
							</div>
						)}

						{/* <div>Aktuelles Foto:</div> TODO: "Mit Button Runterladen" */}
					</ModalConfirm>
				)}

				{showModal_MoveDevice && (
					<ModalDefault
						show={showModal_MoveDevice}
						onClose={() =>
							this.setState({ showModal_MoveDevice: false })
						}
						header={t('devices.move.header')}
					>
						<div className="h-[calc(100%-10rem)] text-left">
							<div className="text-xs mb-4">
								<AlarmRow
									alarm
									alarmText={t('devices.move.noticeDuration')}
									color="6"
									translated
								/>
							</div>
							<Tenant
								onClick={(e) =>
									this.moveDevice(
										e.currentTarget.dataset.tenantid,
										device
									)
								}
							/>
						</div>
					</ModalDefault>
				)}

				{showModal_Prov && (
					<ModalConfirm
						show={showModal_Prov}
						saveModal={() => {
							this.changeProvisioned(!this.state.isChecked)
							this.setState({ showModal_Prov: false })
						}}
						icon={faExclamationCircle}
						onClose={() => this.setState({ showModal_Prov: false })}
					>
						<p>
							{this.state.isChecked
								? t('devices.provisioned.modal.noProv')
								: t('devices.provisioned.modal.Prov')}
						</p>
					</ModalConfirm>
				)}
			</div>
		)
	}
}
