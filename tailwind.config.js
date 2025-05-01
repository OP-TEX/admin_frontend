/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Dark mode colors
				dark: {
					primary: '#1f2937', // gray-800
					secondary: '#111827', // gray-900
					accent: '#6366f1', // indigo-600
					text: '#f9fafb', // gray-50
					textSecondary: '#9ca3af', // gray-400
					border: '#374151', // gray-700
				},
				// Light mode colors
				light: {
					primary: '#f9fafb', // gray-50
					secondary: '#f3f4f6', // gray-100
					accent: '#4f46e5', // indigo-700
					text: '#111827', // gray-900
					textSecondary: '#4b5563', // gray-600
					border: '#e5e7eb', // gray-200
				},
			},
		},
	},
	plugins: [],
};
