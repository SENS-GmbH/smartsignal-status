import { Breadcrumb } from 'flowbite-react'
import { NavLink, useLocation } from 'react-router-dom'
import HomeIcon from './HomeIcon'

function Breadcrumbs() {
	const location = useLocation()

	var currentTenantName = 'Test-Standort'
	var currentUsecaseName = 'Test-Use-Case'
	var currentDeviceName = 'Test-Gerät'

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
					array.push({ name: 'Standorte', path: key })
					if (newPath[i + 1]) {
						// Richtigen Context finden (trun())
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
				<NavLink to="">Home</NavLink>
			</Breadcrumb.Item>
			{/* TODO: Crumbs selber gestalten */}
			{allLocation(location.pathname).map((crumb, i) => (
				<Breadcrumb.Item key={i + '_Breadcrumb'}>
					<NavLink to={getLink(crumb.path)}>{crumb.name}</NavLink>
				</Breadcrumb.Item>
			))}
		</Breadcrumb>
	)
}

export default Breadcrumbs
