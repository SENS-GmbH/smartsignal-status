import React, { Component } from 'react'
import Headline from '../../../../../../../shared/components/Custom/Headline'
import { Button } from 'flowbite-react'
import Context from '#context'
import Scanner from './Scanner'
import { Navigate } from 'react-router-dom'
import Input from '#comp/Custom/Input'
import defaultValues from '#shared/backend/defaultValues.json'
import checkToast from '#helper/toastHandler/checkToast'
import { defaultFetch } from '#helper/Fetch API/request'
import { filterDevices } from '#helper/Fetch API/filter'
import LoadingScreen from '#comp/LoadingScreen'

export default class SelectFinder extends Component {
	static contextType = Context
	state = {
		code: null,
		scanner: false,
		searching: false,
		loading: false,
		devices: [],
		afterSearch: false,
	}
	setCode = (code) => {
		this.setState({
			code: code,
		})
	}

	// TODO: Schönerer Code, wurde in Eile gemacht, damit es funkt

	// TODO: Gemeinsame Input-Liste mit "Tenant", sodass dies auch für Tenants und für Geräte funktioniert.

	t = this.context.t

	delayFetchDevices
	delayEnterChars

	deviceSearch = defaultValues.deviceSearch

	delayInput = (e) => {
		clearTimeout(this.delayEnterChars)
		clearTimeout(this.delayFetchDevices)

		const value = e.target.value

		if (value.length < this.deviceSearch.minLength) {
			this.delayEnterChars = setTimeout(() => {
				checkToast(this.t, 12002, null, {
					minChars: this.deviceSearch.minLength,
				})
			}, this.deviceSearch.timeout)
			return
		}

		this.setState({ loading: true })

		this.delayFetchDevices = setTimeout(async () => {
			const pageSize = 50
			const devices = await defaultFetch(
				`${this.context.instance.api}/Device`,
				{
					method: 'POST',
					headers: {
						Authorization: this.context.auth.access_token,
						'Content-Type': 'application/json-patch+json',
					},
					body: JSON.stringify(filterDevices(value, 0, pageSize)),
				},
				() => checkToast(this.t, 'NUMBER')
			)
			// TODO: Diese Pagesize Limitation auch für Tenantsuche einbauen.
			if (devices.total_cound > pageSize) {
				// Es wurden nur die ersten {{pageSize}} angezeigt.
				checkToast(this.t, 'NUMBER')
			}
			this.setState({
				devices: devices.devices,
				loading: false,
				afterSearch: true,
			})
		}, this.deviceSearch.timeout)
	}

	render() {
		const { code } = this.state
		const { t } = this.context

		if (code) {
			return <Navigate to={'./' + code} replace />
		}
		return (
			<div>
				<Headline hr>{t('all.add.addDevice')}</Headline>
				<div className="flex gap-2 mb-4">
					<Button
						disabled={this.state.scanner}
						color="green"
						className="w-1/2"
						onClick={() =>
							this.setState({
								scanner: true,
								searching: false,
							})
						}
					>
						{this.context.t('devices.search.scanner')}
					</Button>
					<Button
						disabled={this.state.searching}
						color="green"
						className="w-1/2"
						onClick={() =>
							this.setState({
								scanner: false,
								searching: true,
							})
						}
					>
						{this.context.t('devices.search.search')}
					</Button>
				</div>
				{this.state.scanner && <Scanner setCode={this.setCode} />}
				{this.state.searching && (
					<div>
						<Input name="searchDevice" onChange={this.delayInput}>
							{this.context.t('devices.search.searchDeviceInput')}
						</Input>
						{this.state.loading && (
							<LoadingScreen.Spinner className="mt-4" />
						)}
						{!this.state.loading &&
							this.state.devices.map((device) => (
								<div
									onClick={() => this.setCode(device.edid)}
									className="cursor-pointer"
									key={device.id}
								>
									<div className="py-2.5 truncate flex flex-col relative">
										<span className="truncate">
											{device.serial} - {device.edid}
										</span>
									</div>
									<div className="border-b border-gray-500" />
								</div>
							))}
						{this.state.afterSearch &&
							this.state.devices.length === 0 && (
								<div className="text-center mt-4">
									{this.context.t('devices.noDevicesInList')}
								</div>
							)}
					</div>
				)}
			</div>
		)
	}
}
