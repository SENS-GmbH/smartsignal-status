import React, { Component } from 'react'

// Shared
import defaultValues from './shared/backend/defaultValues.json'
import { getLS, saveLS } from './shared/helper/localStorage'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context
import Context from './shared/context'

// Components
import Router from './components/Home/Router'

export default class App extends Component {
	state = {
		darkMode: false,
		progress: 1,
		sidebar: false,
		language: null,
		showModal: false,
	}

	/**
	 * Set the html root to the correct theme and save it to localStorage
	 * @param {Boolean} darkMode
	 */
	handleDarkMode = (darkMode) => {
		const htmlRoot = window.document.getElementById('html-root')
		// const myArray = ['bg-gray-900', 'dark']

		htmlRoot.className = darkMode ? 'bg-gray-900 dark' : 'bg-white'
		saveLS('darkMode', darkMode)
		this.setState({ darkMode: darkMode })
	}

	/**
	 * Change state of modal so you can work with that in the whole application.
	 * @param {Boolean} state
	 */
	openModal = (state) => {
		this.setState({ showModal: state })
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
			if (defaultValues.allLanguages.includes(navigator.language)) {
				language = navigator.language
			} else {
				language = defaultValues.language
			}
		}
		document.documentElement.lang = language
		this.props.i18n.changeLanguage(language)
		this.setState({ language })
		saveLS('language', language)
	}

	changeFont = (font) => {
		if (!font) {
			font = defaultValues.font
		}
		this.setState({ font })
		saveLS('font', font)
	}

	// init Dark and language on load
	componentDidMount = () => {
		this.initDarkMode()
		this.changeLanguage(getLS('language'))
	}

	// TODO: Alle "helper" auf einen Context umwickeln (Performace?)

	render() {
		const { darkMode, progress, sidebar, language, font, showModal } =
			this.state
		const { t } = this.props
		return (
			<Context.Provider
				value={{
					darkMode: darkMode,
					changeDarkMode: () => {
						this.handleDarkMode(!darkMode)
					},
					progress: progress,
					handleProgressbar: this.handleProgressbar.bind(this),
					sidebar: sidebar,
					changeSidebar: () => {
						this.setState({ sidebar: !sidebar })
					},
					t: t,
					changeLanguage: (lang) => {
						this.changeLanguage(lang)
					},
					language: language,
					changeFont: (font) => this.changeFont(font),
					font: font,
					openModal: this.openModal,
					showModal: showModal,
				}}
			>
				<div className={'mx-auto h-full shadow-md max-w-3xl ' + font}>
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
					theme={darkMode ? 'dark' : 'light'}
				/>
			</Context.Provider>
		)
	}
}
