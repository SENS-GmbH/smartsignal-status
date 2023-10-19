import React from 'react'
import ReactDOM from 'react-dom/client'

// Load CSS
import './css/index.css'
import './css/fonts/montserrat/fonts.css'

// Load Animantions
import '@animxyz/core'

// Load App
import App from './App'

// Multi-Language
import { I18nextProvider, useTranslation } from 'react-i18next'
import i18next from 'i18next'
import trans_de from './translations/de/common.json'
import trans_en from './translations/en/common.json'

i18next.init({
	lng: 'en',
	resources: {
		en: {
			common: trans_en, // 'common' is our custom namespace
		},
		de: {
			common: trans_de,
		},
	},
})

// Wrap the whole App, becuase of the hook "useTranslation", so we can use it across the project in the context!
const AppWrapper = () => {
	const { t, i18n } = useTranslation('common')

	return <App t={t} i18n={i18n} />
}

const root = ReactDOM.createRoot(document.getElementById('root'))

// Enable Strict-Mode in production, so the API don't get the requests twice in development
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	root.render(
		<I18nextProvider i18n={i18next}>
			<AppWrapper />
		</I18nextProvider>
	)
} else {
	root.render(
		<React.StrictMode>
			<I18nextProvider i18n={i18next}>
				<AppWrapper />
			</I18nextProvider>
		</React.StrictMode>
	)
}
