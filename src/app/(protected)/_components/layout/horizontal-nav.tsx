"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Calendar,
	Contact,
	FileKey,
	FileText,
	Home,
	Layers,
	Lock,
	Trophy,
	Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const menuItems = [
	{
		title: "Dashboard",
		icon: Home,
		href: "/dashboard",
	},
	{
		title: "Pages",
		icon: FileText,
		items: [
			{
				title: "Authentication",
				icon: Lock,
				href: "/auth",
			},
			{
				title: "Courses",
				icon: BookOpen,
				href: "/courses",
			},
			{
				title: "Users",
				icon: Users2,
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
		title: "Apps",
		icon: Layers,
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
];

export function HorizontalNav() {
	const pathname = usePathname();

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3 },
		},
	};

	return (
		<motion.div variants={containerVariants} initial="hidden" animate="show">
			<NavigationMenu className="max-w-none justify-start">
				<NavigationMenuList className="space-x-2">
					{menuItems.map((item) => {
						if (!item.items) {
							return (
								<motion.div key={item.title} variants={itemVariants}>
									<NavigationMenuItem>
										<Link
											href={item.href}
											className={cn(
												"group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
												pathname === item.href && "bg-accent",
											)}
										>
											<item.icon className="mr-2 h-4 w-4" />
											{item.title}
										</Link>
									</NavigationMenuItem>
								</motion.div>
							);
						}

						return (
							<motion.div key={item.title} variants={itemVariants}>
								<NavigationMenuItem>
									<NavigationMenuTrigger>
										<item.icon className="mr-2 h-4 w-4" />
										{item.title}
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
											{item.items.map((subItem) => (
												<motion.li
													key={subItem.title}
													whileHover={{ x: 4 }}
													transition={{ duration: 0.2 }}
												>
													<NavigationMenuLink asChild>
														<Link
															href={subItem.href}
															className={cn(
																"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
																pathname === subItem.href && "bg-accent",
															)}
														>
															<div className="flex items-center gap-2">
																<subItem.icon className="h-4 w-4" />
																<div className="text-sm font-medium leading-none">
																	{subItem.title}
																</div>
															</div>
														</Link>
													</NavigationMenuLink>
												</motion.li>
											))}
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</motion.div>
						);
					})}
				</NavigationMenuList>
			</NavigationMenu>
		</motion.div>
	);
}
