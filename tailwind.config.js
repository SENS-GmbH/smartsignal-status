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
			},
		},
	},
	plugins: [
		require('tailwindcss'),
		require('autoprefixer'),
		require('flowbite/plugin'),
	],
}
