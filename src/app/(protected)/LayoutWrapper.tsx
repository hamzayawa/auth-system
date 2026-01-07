"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./dashboard/_components/providers/theme-provider";
import { Header } from "./dashboard/_components/layout/header";
import { HorizontalNav } from "./dashboard/_components/layout/horizontal-nav";
import { Sidebar } from "./dashboard/_components/layout/sidebar";
import { motion, AnimatePresence } from "framer-motion";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		// 👈 SSR: Always render horizontal layout (most common)
		return (
			<div className="relative flex min-h-screen flex-col">
				<header className="flex h-16 items-center border-b px-4" />
				<div className="border-b px-4 py-2" />
				<main className="flex-1 p-4">{children}</main>
			</div>
		);
	}

	return (
		<>
			{theme.layout === "horizontal" ? (
				<div className="relative flex min-h-screen flex-col">
					<Header showMenu={false} />
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className="border-b px-4 py-2"
					>
						<HorizontalNav />
					</motion.div>
					<main className="flex-1">
						<AnimatePresence mode="wait">
							<motion.div
								key="horizontal"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
							>
								{children}
							</motion.div>
						</AnimatePresence>
					</main>
				</div>
			) : (
				<div className="relative flex min-h-screen flex-col lg:flex-row">
					<div className="hidden lg:block">
						<Sidebar />
					</div>
					<div className="flex-1">
						<Header />
						<main className="flex-1">
							<AnimatePresence mode="wait">
								<motion.div
									key="vertical"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
								>
									{children}
								</motion.div>
							</AnimatePresence>
						</main>
					</div>
				</div>
			)}
		</>
	);
}
