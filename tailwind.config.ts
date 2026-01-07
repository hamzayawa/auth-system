import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./pages/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				/* Raw fonts (optional, still useful) */
				aeonik: ["var(--font-aeonik)"],
				satoshi: ["var(--font-satoshi)"],
				inter: ["var(--font-inter)"],
				manrope: ["var(--font-manrope)"],
				poppins: ["var(--font-poppins)"],

				/* Semantic roles (recommended) */
				heading: ["var(--font-heading)"],
				subheading: ["var(--font-subheading)"],
				body: ["var(--font-body)"],
				reading: ["var(--font-reading)"],
				accent: ["var(--font-accent)"], // poppins
			},
			fontWeight: {
				// Heading / Aeonik weights
				"heading-100": "100",
				"heading-300": "300",
				"heading-400": "400",
				"heading-500": "500",
				"heading-700": "700",
				"heading-900": "900",

				// Subheading / Satoshi weights
				"subheading-100": "100",
				"subheading-300": "300",
				"subheading-400": "400",
				"subheading-500": "500",
				"subheading-700": "700",
				"subheading-900": "900",

				// Body / Inter weights
				"body-100": "100",
				"body-300": "300",
				"body-400": "400",
				"body-500": "500",
				"body-700": "700",
				"body-900": "900",

				// Reading / Manrope weights
				"reading-100": "100",
				"reading-300": "300",
				"reading-400": "400",
				"reading-500": "500",
				"reading-700": "700",
				"reading-900": "900",

				// Accent / Poppins weights
				"accent-100": "100",
				"accent-300": "300",
				"accent-400": "400",
				"accent-500": "500",
				"accent-700": "700",
				"accent-900": "900",
			},
		},
	},
	plugins: [],
};

export default config;
