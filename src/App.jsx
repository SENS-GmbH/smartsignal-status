import React, { Component } from 'react'

import { Context } from './shared/context'
import Router from './components/Home/Router'
import { getLS, saveLS } from './shared/helper/localStorage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default class App extends Component {
	state = {
		darkMode: true,
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

	initDarkMode = () => {
		var darkMode = this.state.darkMode
		if (getLS('darkMode') !== null) {
			darkMode = getLS('darkMode') === 'true'
		}
		this.handleDarkMode(darkMode)
	}

	componentDidMount = () => {
		this.initDarkMode()
	}

	render() {
		return (
			<Context.Provider
				value={{
					darkMode: this.state.darkMode,
					changeDarkMode: () => {
						this.handleDarkMode(!this.state.darkMode)
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

				{/* TODO: Update Toast auf  */}
				<ToastContainer
					position="top-center"
					autoClose={2000}
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
