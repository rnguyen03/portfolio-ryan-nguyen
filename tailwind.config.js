const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./mdx-components.tsx",
		"content/**/*.mdx",
	],

	theme: {
		extend: {
			colors: {
				// Semantic palette: "Matcha Stationery" (revised - warm café tones)
				paper: "#F5F1E6",
				card: "#EEE7D8",
				ink: "#2F2B24",
				subink: "#6C6A5C",
				matcha: {
					DEFAULT: "#5F7D4E",
					light: "#A7C49A",
					dark: "#3E5C34",
					50: '#f7faf5',
					100: '#eef5e8',
					200: '#dcebd1',
					300: '#c5ddb4',
					400: '#a8cc8f',
					500: '#8bb86d',
					600: '#6fa051',
					700: '#588041',
					800: '#476636',
					900: '#3a522d',
					950: '#1e2d18',
				},
				latte: "#D3BCA2",
				clay: "#C78B6C",
				line: "#D9D2C3",
				// Legacy aliases for gradual migration
				text: "#2F2B24",
				subtext: "#6C6A5C",
				border: "#D9D2C3",
				creamAccent: "#F5F1E6",
				matchaBrand: {
					DEFAULT: "#5F7D4E",
					light: "#A7C49A",
					dark: "#3E5C34",
				},
				cream: {
					50: '#fefdfb',
					100: '#fdf9f3',
					200: '#faf3e8',
					300: '#f5ead8',
					400: '#ecdcc4',
					500: '#e0ccae',
					600: '#c9af8b',
					700: '#b39571',
					800: '#967c5e',
					900: '#7d684f',
				},
			},
			typography: {
				DEFAULT: {
					css: {
						"code::before": {
							content: '""',
						},
						"code::after": {
							content: '""',
						},
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			fontFamily: {
				sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
				display: ["var(--font-calsans)"],
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
				"matcha-gradient": "linear-gradient(135deg, #f7faf5 0%, #eef5e8 25%, #dcebd1 50%, #c5ddb4 75%, #a8cc8f 100%)",
				"cozy-gradient": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
			},
			animation: {
				"fade-in": "fade-in 2s ease-in-out forwards",
				"fade-in-slow": "fade-in 3s ease-in-out forwards",
				"slide-up": "slide-up 1.5s ease-out forwards",
				title: "title 2.5s ease-out forwards",
				"fade-left": "fade-left 2.5s ease-in-out forwards",
				"fade-right": "fade-right 2.5s ease-in-out forwards",
				"gentle-bounce": "gentle-bounce 2s ease-in-out infinite",
				"pulse-soft": "pulse-soft 3s ease-in-out infinite",
				"float": "float 6s ease-in-out infinite",
				"glow-pulse": "glow-pulse 2s ease-in-out infinite",
			},
			keyframes: {
				"fade-in": {
					"0%": {
						opacity: "0%",
					},
					"75%": {
						opacity: "0%",
					},
					"100%": {
						opacity: "100%",
					},
				},
				"slide-up": {
					"0%": {
						transform: "translateY(20px)",
						opacity: "0",
					},
					"100%": {
						transform: "translateY(0)",
						opacity: "1",
					},
				},
				"fade-left": {
					"0%": {
						transform: "translateX(100%)",
						opacity: "0%",
					},
					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				"fade-right": {
					"0%": {
						transform: "translateX(-100%)",
						opacity: "0%",
					},
					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				title: {
					"0%": {
						"line-height": "0%",
						"letter-spacing": "0.25em",
						opacity: "0",
					},
					"25%": {
						"line-height": "0%",
						opacity: "0%",
					},
					"80%": {
						opacity: "100%",
					},
					"100%": {
						"line-height": "100%",
						opacity: "100%",
					},
				},
				"gentle-bounce": {
					"0%, 100%": {
						transform: "translateY(0)",
					},
					"50%": {
						transform: "translateY(-10px)",
					},
				},
				"pulse-soft": {
					"0%, 100%": {
						opacity: "1",
					},
					"50%": {
						opacity: "0.7",
					},
				},
				"float": {
					"0%, 100%": {
						transform: "translateY(0px)",
					},
					"50%": {
						transform: "translateY(-20px)",
					},
				},
				"glow-pulse": {
					"0%, 100%": {
						boxShadow: "0 0 20px rgba(168, 204, 143, 0.3)",
					},
					"50%": {
						boxShadow: "0 0 40px rgba(168, 204, 143, 0.6)",
					},
				},
			},
			boxShadow: {
				'matcha-sm': '0 2px 8px rgba(168, 204, 143, 0.15)',
				'matcha-md': '0 4px 16px rgba(168, 204, 143, 0.2)',
				'matcha-lg': '0 8px 32px rgba(168, 204, 143, 0.25)',
				'matcha-xl': '0 12px 48px rgba(168, 204, 143, 0.3)',
				'cream': '0 4px 16px rgba(221, 209, 191, 0.2)',
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-debug-screens"),
	],
};
