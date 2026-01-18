"use client";

import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { Header } from "./_components/layout/header";
import { HorizontalNav } from "./_components/layout/horizontal-nav";
import { Sidebar } from "./_components/layout/sidebar";
import { useTheme } from "./_components/providers/theme-provider";

interface LayoutWrapperProps {
	children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const { theme } = useTheme();

	return (
		<>
			{theme.layout === "horizontal" ? (
				<div className="relative flex min-h-screen flex-col">
					<Header />
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
				<div className="relative flex min-h-screen">
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
