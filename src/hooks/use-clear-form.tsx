"use client";

import type React from "react";

import { useEffect } from "react";

export function useClearForm<T>(
	setState: React.Dispatch<React.SetStateAction<T>>,
	initialState: T,
) {
	useEffect(() => {
		// Clear form on mount and when navigating
		setState(initialState);

		// Clear form when page becomes visible (handles browser back/forward)
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				setState(initialState);
			}
		};

		// Clear form on page focus (handles tab switching)
		const handleFocus = () => {
			setState(initialState);
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("focus", handleFocus);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("focus", handleFocus);
		};
	}, [setState, initialState]);
}
