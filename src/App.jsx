import React, { Component } from 'react'

import { Context } from './shared/context'
import Router from './components/Home/Router'
import defaultValues from './shared/backend/defaultValues.json'
import { getLS, saveLS } from './shared/helper/localStorage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default class App extends Component {
	state = {
		darkMode: true,
		progress: 30,
		sidebar: false,
	}

	handleDarkMode = (darkMode) => {
		if (darkMode) {
			window.document
				.getElementById('html-root')
				.classList.add('bg-gray-900')
			window.document
				.getElementById('html-root')
				.classList.remove('bg-white')
		} else {
			window.document
				.getElementById('html-root')
				.classList.remove('bg-gray-900')
			window.document
				.getElementById('html-root')
				.classList.add('bg-white')
		}

		saveLS('darkMode', darkMode)
		this.setState({ darkMode: darkMode })
	}

	handleProgressbar = (progress) => {
		this.setState({ progress: progress })
	}

	initDarkMode = () => {
		var darkMode = this.state.darkMode
		if (getLS('darkMode') !== null) {
			darkMode = getLS('darkMode') === defaultValues.darkMode.toString()
		}
		this.handleDarkMode(darkMode)
	}

	changeLanguage = (language) => {
		if (!language) {
			language = defaultValues.language
		}
		this.props.i18n.changeLanguage(language)
		saveLS('language', language)
	}

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
					className={
						'mx-auto h-full shadow-md dark:border-gray-700 max-w-3xl' +
						(this.state.darkMode ? ' dark' : '')
					}
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
