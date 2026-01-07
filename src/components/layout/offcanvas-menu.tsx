"use client";

import gsap from "gsap";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface MenuItem {
	href: string;
	label: string;
	subItems?: { name: string; href: string }[];
}

interface OffcanvasMenuProps {
	isOpen: boolean;
	onClose: () => void;
	menuItems?: MenuItem[];
}

export function OffcanvasMenu({
	isOpen,
	onClose,
	menuItems: customMenuItems,
}: OffcanvasMenuProps) {
	const offcanvasRef = useRef<HTMLDivElement>(null);
	const menuItemsRef = useRef<HTMLLIElement[]>([]);

	const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

	const showCanvas3 = useCallback(() => {
		const canvas3 = gsap.timeline();

		canvas3.to(offcanvasRef.current, {
			left: 0,
			visibility: "visible",
			duration: 0.8,
			opacity: 1,
			rotationY: 0,
			perspective: 0,
		});

		canvas3.to(
			menuItemsRef.current,
			{
				opacity: 1,
				top: 0,
				stagger: 0.05,
				duration: 1,
				rotationX: 0,
			},
			"-=0.1",
		);
	}, []);

	const hideCanvas3 = useCallback(() => {
		const canvas3 = gsap.timeline();

		canvas3.to(offcanvasRef.current, {
			duration: 0.8,
			rotationY: -90,
			opacity: 0,
		});

		canvas3.to(offcanvasRef.current, {
			visibility: "hidden",
			duration: 0.1,
			rotationY: 50,
			left: 0,
			rotationX: 0,
		});

		canvas3.to(menuItemsRef.current, {
			opacity: 0,
			top: -100,
			stagger: 0.01,
			duration: 0.1,
			rotationX: 50,
		});
	}, []);

	useEffect(() => {
		if (isOpen) {
			showCanvas3();
			document.body.style.overflow = "hidden";
		} else {
			hideCanvas3();
			document.body.style.overflow = "auto";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen, showCanvas3, hideCanvas3]);
	const menuItems = customMenuItems || [
		{ href: "#", label: "home" },
		{ href: "#about", label: "about" },
		{ href: "#services", label: "services" },
		{ href: "#service-details", label: "service details" },
		{ href: "#projects", label: "projects" },
		{ href: "#project-details", label: "project details" },
		{ href: "#team", label: "team" },
		{ href: "#team-details", label: "team details" },
		{ href: "#career", label: "career" },
		{ href: "#career-details", label: "career details" },
		{ href: "#faq", label: "faq" },
		{ href: "#blog", label: "blog" },
		{ href: "#blog-details", label: "blog details" },
		{ href: "#contact", label: "Contact" },
	];

	return (
		<div ref={offcanvasRef} className="offcanvas-3__area">
			<div className="offcanvas-3__inner">
				<div className="offcanvas-3__meta-wrapper">
					<div>
						<button
							id="close_offcanvas"
							type="button"
							className="close-button close-offcanvas"
							onClick={onClose}
						>
							<span></span>
							<span></span>
						</button>
					</div>
				</div>
				<div className="offcanvas-3__menu-wrapper">
					<nav className="nav-menu offcanvas-3__menu">
						<ul>
							{menuItems.map((item, index) => (
								<li
									key={`${item.label}-${item.href}`} // unique and stable
									ref={(el) => {
										if (el) menuItemsRef.current[menuItems.indexOf(item)] = el;
									}}
									className="border-b border-white/10"
								>
									<div className="flex items-center justify-between group">
										<a
											href={item.href}
											onClick={onClose}
											className="flex-1 transition-all duration-300 hover:text-yellow-400 hover:pl-2"
										>
											{item.label}
										</a>
										{item.subItems && (
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													setOpenSubMenu(openSubMenu === index ? null : index);
												}}
												className="p-2 text-white hover:text-yellow-400 transition-colors"
											>
												{openSubMenu === index ? (
													<ChevronUp size={20} />
												) : (
													<ChevronDown size={20} />
												)}
											</button>
										)}
									</div>
									{item.subItems && openSubMenu === index && (
										<ul className="pl-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
											{item.subItems.map((sub) => (
												<li
													key={`${sub.name}-${sub.href}`} // unique and stable key
													className="!opacity-100 !top-0 !rotate-x-0"
												>
													<a
														href={sub.href}
														className="!text-[16px] opacity-70 transition-all duration-300 hover:opacity-100 hover:text-yellow-400 hover:pl-1"
														onClick={onClose}
													>
														{sub.name}
													</a>
												</li>
											))}
										</ul>
									)}
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
}
