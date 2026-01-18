"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Calendar,
	Contact,
	FileKey,
	Home,
	Lock,
	Settings,
	Trophy,
	Users,
	Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSidebar } from "../providers/sidebar-provider";

const menuItems = [
	{
		title: "MENU",
		items: [
			{
				title: "Dashboard",
				icon: Home,
				href: "/dashboard",
			},
		],
	},
	{
		title: "PAGES",
		items: [
			{
				title: "Authentication",
				icon: Lock,
				href: "/auth",
			},
			{
				title: "Courses",
				icon: BookOpen,
				href: "/pages",
			},
			{
				title: "Users",
				icon: Users,
				href: "/users",
			},
			{
				title: "Components",
				icon: Users2,
				href: "/components",
			},
		],
	},
	{
		title: "APPS",
		items: [
			{
				title: "Calendar",
				icon: Calendar,
				href: "/calendar",
			},
			{
				title: "API Key",
				icon: FileKey,
				href: "/api-key",
			},
			{
				title: "Contact",
				icon: Contact,
				href: "/contact",
			},
			{
				title: "LeaderBoard",
				icon: Trophy,
				href: "/leaderboard",
			},
		],
	},
	{
		title: "LAYOUTS",
		items: [
			{
				title: "Settings",
				icon: Settings,
				href: "/settings",
			},
		],
	},
];

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const pathname = usePathname();
	const { isOpen } = useSidebar();

	const isMobileView = className?.includes("w-full");

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -10 },
		show: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.3 },
		},
	};

	return (
		<motion.div
			className={cn("flex h-full flex-col border-r bg-background", className)}
			animate={{ width: isOpen ? "16rem" : "4rem" }}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			style={{ overflow: "hidden" }}
		>
			<div className="flex h-16 items-center border-b px-6">
				<div className="relative h-8 w-8">
					<Image
						src="/logo.png"
						alt="LEARN Logo"
						fill
						className="object-contain"
						priority
					/>
				</div>
				<motion.span
					className="ml-3 text-lg font-semibold whitespace-nowrap"
					animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? "auto" : 0 }}
					transition={{ duration: 0.2 }}
				>
					LEARN
				</motion.span>
			</div>

			<ScrollArea className="flex-1">
				<motion.div
					className="space-y-4 py-4"
					variants={containerVariants}
					initial="hidden"
					animate="show"
				>
					{menuItems.map((section) => (
						<motion.div
							key={section.title}
							className={cn("px-3 py-2", !isOpen && "px-1")}
							variants={itemVariants}
						>
							<motion.h4
								className="mb-1 px-2 text-xs font-semibold text-muted-foreground"
								animate={{
									opacity: isOpen ? 1 : 0,
									height: isOpen ? "auto" : 0,
								}}
								transition={{ duration: 0.2 }}
							>
								{section.title}
							</motion.h4>
							<div className="grid gap-1">
								{section.items.map((item, index) => (
									<motion.div
										key={item.title}
										variants={itemVariants}
										transition={{ delay: index * 0.05 }}
									>
										<Button
											variant="ghost"
											asChild
											className={cn(
												"w-full transition-colors duration-200",
												isOpen ? "justify-start" : "justify-center",
												pathname === item.href &&
													"bg-muted font-medium hover:bg-muted",
											)}
											title={!isOpen ? item.title : undefined}
										>
											<Link href={item.href}>
												<motion.div
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
													className="flex items-center"
												>
													<item.icon className="h-5 w-5" />
													<motion.span
														className="ml-3 whitespace-nowrap"
														animate={{
															opacity: isOpen ? 1 : 0,
															width: isOpen ? "auto" : 0,
														}}
														transition={{ duration: 0.2 }}
													>
														{item.title}
													</motion.span>
												</motion.div>
											</Link>
										</Button>
									</motion.div>
								))}
							</div>
						</motion.div>
					))}
				</motion.div>
			</ScrollArea>
		</motion.div>
	);
}
