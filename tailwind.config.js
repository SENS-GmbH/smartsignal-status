const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = withMT({
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
			},
		},
	},
	plugins: [
		require('tailwindcss'),
		require('autoprefixer'),
		require('flowbite/plugin'),
	],
})
