"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, Globe, LayoutGrid, Moon, ShoppingBag, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ExpandableSearchBar from "../ExpandableSearchBar";
import FriesMenu from "../providers/FriesMenu";
import { useSidebar } from "../providers/sidebar-provider";
import { ProfileMenu } from "./profile";
import { Sidebar } from "./sidebar";

interface HeaderProps {
	showMenu?: boolean;
}

export function Header({ showMenu = true }: HeaderProps) {
	const { toggle } = useSidebar();
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleTheme = () => {
		setIsDarkMode(!isDarkMode);
		if (typeof document !== "undefined") {
			document.documentElement.classList.toggle("dark", !isDarkMode);
		}
	};

	return (
		<header className="flex h-16 items-center border-b px-4 animate-slide-down">
			<div className="flex flex-1 items-center gap-4">
				{showMenu && (
					<>
						<Sheet>
							<SheetTrigger asChild>
								<motion.div
									className="lg:hidden"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<FriesMenu onClick={() => {}} />
								</motion.div>
							</SheetTrigger>
							<SheetContent side="left" className="p-0 w-72">
								<Sidebar className="w-full" />
							</SheetContent>
						</Sheet>

						<motion.div
							className="hidden lg:block"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<FriesMenu onClick={toggle} />
						</motion.div>
					</>
				)}

				<motion.div
					className="relative w-full max-w-md"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<ExpandableSearchBar />
				</motion.div>
			</div>

			<motion.div
				className="flex items-center gap-2"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				{/* Grid Icon */}
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
					<Button variant="ghost" size="icon">
						<LayoutGrid className="h-5 w-5" />
					</Button>
				</motion.div>

				{/* Shopping Bag Icon */}
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
					<Button variant="ghost" size="icon" className="relative">
						<ShoppingBag className="h-5 w-5" />
						<motion.span
							className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.3, delay: 0.5 }}
						>
							2
						</motion.span>
					</Button>
				</motion.div>

				{/* Theme Toggle */}
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
					<Button variant="ghost" size="icon" onClick={toggleTheme}>
						<AnimatePresence mode="wait">
							{isDarkMode ? (
								<motion.div
									key="moon"
									initial={{ rotate: -180, opacity: 0 }}
									animate={{ rotate: 0, opacity: 1 }}
									exit={{ rotate: 180, opacity: 0 }}
									transition={{ duration: 0.3 }}
								>
									<Moon className="h-5 w-5" />
								</motion.div>
							) : (
								<motion.div
									key="sun"
									initial={{ rotate: 180, opacity: 0 }}
									animate={{ rotate: 0, opacity: 1 }}
									exit={{ rotate: -180, opacity: 0 }}
									transition={{ duration: 0.3 }}
								>
									<Sun className="h-5 w-5" />
								</motion.div>
							)}
						</AnimatePresence>
					</Button>
				</motion.div>

				{/* Notification Bell */}
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
					<Button variant="ghost" size="icon" className="relative">
						<Bell className="h-5 w-5" />
						<motion.span
							className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.3, delay: 0.6 }}
						>
							4
						</motion.span>
					</Button>
				</motion.div>

				{/* Globe Icon */}
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
					<Button variant="ghost" size="icon">
						<Globe className="h-5 w-5" />
					</Button>
				</motion.div>

				<motion.div className="flex items-center gap-2">
					<ProfileMenu />
				</motion.div>
			</motion.div>
		</header>
	);
}
