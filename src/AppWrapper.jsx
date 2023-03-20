import React from 'react'
import { useTranslation } from 'react-i18next'
import App from './App'

export const AppWrapper = () => {
	const { t, i18n } = useTranslation('common')

	return <App t={t} i18n={i18n} />
}
