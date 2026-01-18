"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";

interface FriesMenuProps {
	onClick: () => void;
}

const FriesMenu: React.FC<FriesMenuProps> = ({ onClick }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => {
		setIsOpen(!isOpen);
		onClick();
	};

	return (
		<motion.div
			className="relative flex h-8 w-8 cursor-pointer items-center justify-center"
			onClick={handleToggle}
			aria-label="Toggle Menu"
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
		>
			<motion.div
				initial={false}
				animate={isOpen ? "open" : "closed"}
				className="relative h-5 w-6"
			>
				<motion.span
					className="absolute left-0 h-0.5 rounded bg-foreground"
					variants={{
						closed: { width: "100%", top: 0 },
						open: { width: "0%", top: 0 },
					}}
					transition={{ duration: 0.2 }}
				/>
				<motion.span
					className="absolute left-0 h-0.5 rounded bg-foreground"
					variants={{
						closed: { width: "75%", top: "50%", transform: "translateY(-50%)" },
						open: { width: "0%", top: "50%", transform: "translateY(-50%)" },
					}}
					transition={{ duration: 0.2 }}
				/>
				<motion.span
					className="absolute left-0 h-0.5 rounded bg-foreground"
					variants={{
						closed: { width: "50%", bottom: 0 },
						open: { width: "0%", bottom: 0 },
					}}
					transition={{ duration: 0.2 }}
				/>

				<motion.div
					className="absolute left-0 top-1/2 -translate-y-1/2"
					variants={{
						closed: { opacity: 0, scale: 0.5 },
						open: { opacity: 1, scale: 1 },
					}}
					transition={{ duration: 0.2 }}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M4 12H20M20 12L14 6M20 12L14 18"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default FriesMenu;
