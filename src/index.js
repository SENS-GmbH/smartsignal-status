import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@animxyz/core'
import { AppWrapper } from './AppWrapper'

// Will be obsulte after migration to Flowbite
// import App from './App-old'

// Multi-Language
// import * as serviceWorker from './serviceWorker'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import common_de from './translations/de/common.json'
import common_en from './translations/en/common.json'

i18next.init({
	interpolation: { escapeValue: false }, // React already does escaping
	resources: {
		en: {
			common: common_en, // 'common' is our custom namespace
		},
		de: {
			common: common_de,
		},
	},
})
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	// <React.StrictMode>
	<I18nextProvider i18n={i18next}>
		<AppWrapper />
	</I18nextProvider>
	// </React.StrictMode>
)

// serviceWorker.unregister()
