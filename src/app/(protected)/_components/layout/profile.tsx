"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, Home, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

/** Utility: generate initials from user name */
function getInitials(name?: string) {
	if (!name) return "U";

	const parts = name.trim().split(" ").filter(Boolean);

	if (parts.length === 1) {
		return parts[0].toUpperCase();
	}

	return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProfileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const { data: session } = authClient.useSession();

	const userName = session?.user?.name ?? "User";
	const userEmail = session?.user?.email ?? "unknown@email.com";
	const imageUrl = session?.user?.image ?? null;

	const initials = getInitials(userName);

	const menuItems = [
		{ icon: User, label: "Profile", href: "/profile" },
		{ icon: Settings, label: "Settings", href: "/settings" },
		{ icon: HelpCircle, label: "Get help", href: "/help" },
		{ icon: Home, label: "Home", href: "/dashboard" },
	];

	async function handleSignOut() {
		await authClient.signOut();
		router.replace("/signin");
	}

	/** Reusable avatar */
	const Avatar = ({ size = 40 }: { size?: number }) => (
		<div
			className="relative rounded-full overflow-hidden flex items-center justify-center
                 bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold"
			style={{ width: size, height: size }}
		>
			{imageUrl ? (
				<Image
					key={imageUrl}
					src={imageUrl}
					alt={userName}
					fill
					className="object-cover"
					sizes="40px"
				/>
			) : (
				<span className="text-sm">{initials}</span>
			)}
		</div>
	);

	return (
		<div className="relative">
			{/* Profile Avatar Button */}
			<motion.button
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				className="flex items-center gap-3 p-2 rounded-lg hover:bg-foreground/5 transition-colors"
				whileHover={{ scale: 1.05 }}
			>
				<Avatar />
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						onMouseEnter={() => setIsOpen(true)}
						onMouseLeave={() => setIsOpen(false)}
						initial={{ opacity: 0, y: -10, x: 20 }}
						animate={{ opacity: 1, y: 0, x: 0 }}
						exit={{ opacity: 0, y: -10, x: 20 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute right-0 top-full mt-2 w-64 bg-background/95 backdrop-blur-md
                       border border-border rounded-lg shadow-xl overflow-hidden z-50"
					>
						{/* User Info */}
						<div className="p-4 border-b border-border/50">
							<div className="flex items-center gap-3">
								{/* <Avatar size={48} /> */}
								<div className="min-w-0">
									{/* <p className="font-semibold text-sm truncate">{userName}</p> */}
									<p className="text-xs text-foreground/60 truncate">
										{userEmail}
									</p>
								</div>
							</div>
						</div>

						{/* Menu Items */}
						<div className="py-2">
							{menuItems.map((item, index) => (
								<motion.a
									key={item.label}
									href={item.href}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.2, delay: index * 0.05 }}
									whileHover={{ x: 5 }}
									className="flex items-center gap-3 px-4 py-2.5 text-sm
                             text-foreground/70 hover:text-foreground hover:bg-foreground/5"
								>
									<item.icon className="w-4 h-4" />
									{item.label}
								</motion.a>
							))}
						</div>

						{/* Sign Out */}
						<div className="border-t border-border/50 p-2">
							<motion.button
								onClick={handleSignOut}
								whileHover={{ x: 5 }}
								className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                           text-red-500 hover:bg-red-500/10 rounded-md"
							>
								<LogOut className="w-4 h-4" />
								Sign out
							</motion.button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
