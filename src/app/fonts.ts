import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";

// Aeonik (Local)
export const aeonik = localFont({
	src: [
		{
			path: "../../public/fonts/aeonik/Aeonik-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/aeonik/Aeonik-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/aeonik/Aeonik-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/aeonik/Aeonik-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/aeonik/Aeonik-Bold-Italic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "../../public/fonts/aeonik/Aeonik-Black.woff2",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--font-aeonik",
	display: "swap",
});

// Inter (Google Font)
export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
});

// Poppins (Google Font)
export const poppins = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
});
