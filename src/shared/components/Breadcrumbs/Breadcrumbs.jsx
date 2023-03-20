import { Breadcrumb } from 'flowbite-react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { Context } from '../../context'
import HomeIcon from './HomeIcon'

function Breadcrumbs(props) {
	const { t } = useTranslation('common')
	const location = useLocation()
	const context = useContext(Context)

	// var currentTenantName = t('test.tenant')
	var currentTenantName = ''
	var currentUsecaseName = t('test.usecase')
	var currentDeviceName = t('test.device')

	var splitedLocation = (path) => {
		var newPath = path.split('/')
		newPath.shift()
		return newPath
	}

	var allLocation = (path) => {
		var newPath = splitedLocation(path)
		var array = []
		for (let i = 1; i < newPath.length; i = i + 2) {
			const key = newPath[i]
			switch (key) {
				case 'tenant':
					array.push({ name: t('bread.tenant'), path: key })
					if (newPath[i + 1]) {
						// TODO: Truncate all paths (ev. mit Überarbeitung in Class Component - fixed width)
						if (
							context.tenants !== null &&
							context.tenantId !== null
						) {
							const myTenant = context.tenants.find(
								(tenant) =>
									tenant.id.toString() === context.tenantId
							)
							const tenantExists = context.tenants.some(
								(tenant) =>
									tenant.id.toString() === context.tenantId
							)

							if (myTenant && typeof myTenant === 'object') {
								currentTenantName = myTenant.name
							} else if (!tenantExists) {
								currentTenantName = context.recentTenants.find(
									(tenant) =>
										tenant.id.toString() ===
										context.tenantId
								).name
							}
						}
						array.push({
							name: currentTenantName,
							path: newPath[i + 1],
						})
					}
					break

				case 'usecase':
					array.push({ name: 'Use-Cases', path: key })
					if (newPath[i + 1]) {
						// Richtigen Context finden (trun())
						array.push({
							name: currentUsecaseName,
							path: newPath[i + 1],
						})
					}
					break

				case 'devices':
					array.push({ name: 'Geräte', path: key })
					if (newPath[i + 1]) {
						// Richtigen Context finden (trun())
						array.push({
							name: currentDeviceName,
							path: newPath[i + 1],
						})
					}
					break

				default:
					break
			}
		}
		return array
	}

	var getLink = (pathString) => {
		var path = location.pathname
		var myIndex = path.indexOf('/', path.indexOf(pathString))
		var text = path
		if (myIndex >= 0) {
			text = path.substring(0, myIndex)
		}
		return text
	}

	return (
		<Breadcrumb aria-label="Default breadcrumb example">
			<Breadcrumb.Item icon={HomeIcon}>
				<NavLink to=""></NavLink>
			</Breadcrumb.Item>
			{/* TODO: Crumbs selber gestalten (und Wrap einbauen) */}
			{allLocation(location.pathname).map((crumb, i) => (
				<Breadcrumb.Item key={i + '_Breadcrumb'}>
					<NavLink to={getLink(crumb.path)}>{crumb.name}</NavLink>
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	)
}

export default Breadcrumbs
