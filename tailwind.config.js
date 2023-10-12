module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		container: {
			center: true,
		},
		extend: {
			screens: {
				xxs: '350px',
				xs: '420px',
			},
			colors: {
				primary: '#0da0e9',
				secondary: '#99ddff',
				test: '#87CEFA',
			},
			dropShadow: {
				fullWhite: '0 0 25px rgb(255 255 255 / 1)',
				fullBlack: '0 0 25px rgb(0 0 0 / 1)',
			},
			boxShadow: {
				smUp: '0 -2px 6px -1px rgba(0,0,0,0.1)',
				smDown: '0 2px 6px -1px rgba(0,0,0,0.1)',
				smRight: '2px 0 6px -1px rgba(0,0,0,0.1)',
				smLeft: '-2px 0 6px -1px rgba(0,0,0,0.1)',
				smAll: '0 0 4px 0px rgba(0,0,0,0.1)',
				smUp_dark: '0 -2px 6px -1px rgba(255,255,255,0.4)',
				smDown_dark: '0 2px 6px -1px rgba(255,255,255,0.4)',
				smRight_dark: '2px 0 6px -1px rgba(255,255,255,0.4)',
				smLeft_dark: '-2px 0 6px -1px rgba(255,255,255,0.4)',
				smAll_dark: '0 0 4px 0px rgba(255,255,255,0.4)',
			},
		},
	},
	plugins: [
		require('tailwindcss'),
		require('autoprefixer'),
		require('flowbite/plugin'),
	],
}
