// DOKU:

const isNotAttribute = (attr) => {
	return (a) => a.name !== attr
}

const isAttribute = (attr) => {
	return (a) => a.name === attr
}

const addAttributeToTop = (attr, newAttr, singleAttr) => {
	if (!attr.find(isAttribute(singleAttr))) {
		return attr
	}
	attr = attr.filter(isNotAttribute(singleAttr))
	attr.unshift(newAttr.find(isAttribute(singleAttr)))
	return attr
}

export const installationPlace = (attr) => {
	if (
		attr.installation_place &&
		attr.installation_place !== '0' &&
		attr.installation_place !== 'Sonstiges'
	) {
		return (
			attr.installation_place +
			(attr.installation_number ? ' ' + attr.installation_number : '')
		)
	} else if (attr.installation_place === 'Sonstiges') {
		return attr.installation_place2
	}
	return ''
}

export const attributesSorting = (attr) => {
	// attr: [{name: '', value: ''}]
	const newAttr = attr

	attr = addAttributeToTop(attr, newAttr, 'installation_place2')
	attr = addAttributeToTop(attr, newAttr, 'installation_number')
	attr = addAttributeToTop(attr, newAttr, 'installation_place')

	attr = attr.filter(isNotAttribute('latitude'))

	attr = attr.filter(isNotAttribute('longitude'))

	if (attr.find(isAttribute('installation_place'))?.value === 'Sonstiges') {
		attr = attr.filter(isNotAttribute('installation_number'))
	} else {
		attr = attr.filter(isNotAttribute('installation_place2'))
	}
	return attr
}
