import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@animxyz/core'
// import App from './App-old'

import { ThemeProvider } from '@material-tailwind/react'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</React.StrictMode>
)
