"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = {
	layout: "vertical" | "horizontal";
	scheme: "light" | "dark";
	width: "fluid" | "boxed";
	position: "fixed" | "scrollable";
	topbar: "light" | "dark";
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialTheme: Theme = {
	layout: "vertical",
	scheme: "light",
	width: "fluid",
	position: "fixed",
	topbar: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
	undefined,
);

export function ThemeProvider({
	children,
	defaultTheme = initialTheme,
}: {
	children: React.ReactNode;
	defaultTheme?: Theme;
}) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== "undefined") {
			const savedTheme = window.localStorage.getItem("theme");
			if (savedTheme) {
				return JSON.parse(savedTheme);
			}
		}
		return defaultTheme;
	});

	useEffect(() => {
		window.localStorage.setItem("theme", JSON.stringify(theme));
		// document.body.classList.toggle("dark", theme.scheme === "dark");
		document.documentElement.classList.toggle("dark", theme.scheme === "dark");
		document.body.classList.toggle("boxed", theme.width === "boxed");
	}, [theme]);

	return (
		<ThemeProviderContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeProviderContext);
	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");
	return context;
}
