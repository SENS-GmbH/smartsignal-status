import React, { Component } from 'react'

// Shared
import defaultValues from './shared/backend/defaultValues.json'
import { getLS, saveLS } from './shared/helper/localStorage'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context
import { Context } from './shared/context'

// Components
import Router from './components/Home/Router'

export default class App extends Component {
	state = {
		darkMode: true,
		progress: 1,
		sidebar: false,
	}

	/**
	 * Set the html root to the correct theme and save it to localStorage
	 * @param {Boolean} darkMode
	 */
	handleDarkMode = (darkMode) => {
		const htmlRoot = window.document.getElementById('html-root')
		htmlRoot.classList.toggle('bg-gray-900', darkMode)
		htmlRoot.classList.toggle('bg-white', !darkMode)
		saveLS('darkMode', darkMode)
		this.setState({ darkMode: darkMode })
	}

	/**
	 * Handle Progrress bar
	 * @param {Number} progress - current progress value
	 */
	handleProgressbar = (progress) => {
		this.setState({ progress: progress })
	}

	// Get current darkMode from localStrorage and call handleDarkMode
	initDarkMode = () => {
		var darkMode = this.state.darkMode
		if (getLS('darkMode') !== null) {
			darkMode = getLS('darkMode') === defaultValues.darkMode.toString()
		}
		this.handleDarkMode(darkMode)
	}

	/**
	 * Change the current Language (init defined on backend/defaultValues.json)
	 * @param {String} language - Countrycode
	 */
	changeLanguage = (language) => {
		if (!language) {
			language = defaultValues.language
		}
		this.props.i18n.changeLanguage(language)
		saveLS('language', language)
	}

	// init Dark and language on load
	componentDidMount = () => {
		this.initDarkMode()
		this.changeLanguage(getLS('language'))
	}

	render() {
		return (
			<Context.Provider
				value={{
					darkMode: this.state.darkMode,
					changeDarkMode: () => {
						this.handleDarkMode(!this.state.darkMode)
					},
					progress: this.state.progress,
					handleProgressbar: this.handleProgressbar.bind(this),
					sidebar: this.state.sidebar,
					changeSidebar: () => {
						this.setState({ sidebar: !this.state.sidebar })
					},
					t: this.props.t,
					changeLanguage: (lang) => {
						this.changeLanguage(lang)
					},
				}}
			>
				<div
					className={`mx-auto h-full shadow-md max-w-3xl${
						this.state.darkMode ? ' dark' : ''
					}`}
				>
					<div className="h-full min-h-screen bg-white dark:bg-gray-800 dark:text-white">
						<Router />
					</div>
				</div>

				{/* TODO: Update Toast auf Flowbite */}
				<ToastContainer
					position="top-right"
					autoClose={2000}
					// autoClose={false}
					hideProgressBar
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss={false}
					draggable
					pauseOnHover={false}
					limit={1}
					theme={this.state.darkMode ? 'dark' : 'light'}
				/>
			</Context.Provider>
		)
	}
}
