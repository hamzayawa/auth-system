"use client";

import gsap from "gsap";
import {
	ArrowRight,
	ChevronDown,
	CreditCard,
	Globe,
	LayoutGrid,
	Newspaper,
	Rocket,
	Settings,
	Store,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { OffcanvasMenu } from "@/components/layout/offcanvas-menu";
import { Button } from "@/components/ui/button";

interface NavItem {
	title: string;
	href: string;
	dropdownContent?: React.ReactNode;
	mobileItems?: {
		name: string;
		description?: string;
		icon?: React.ComponentType<{ size: number; className?: string }>;
	}[];
}

const navItems: NavItem[] = [
	{
		title: "Products",
		href: "#",
		mobileItems: [
			{ name: "Payments", description: "Online payments", icon: CreditCard },
			{ name: "Checkout", description: "Hosted payments page", icon: Store },
			{
				name: "Elements",
				description: "Customizable payments UIs",
				icon: LayoutGrid,
			},
			{
				name: "Billing",
				description: "Subscription management",
				icon: Newspaper,
			},
			{
				name: "Connect",
				description: "Payments for platforms",
				icon: Settings,
			},
		],
		dropdownContent: (
			<div className="relative">
				{/* Arrow (Triangle) */}
				<div
					className="absolute -top-2.5 left-10 w-0 h-0 
                       border-l-[10px] border-r-[10px] border-b-[10px] 
                       border-transparent border-b-white z-10"
				/>
				{/* Background arrow */}
				<div
					className="absolute -top-2.5 left-10 w-0 h-0 
                       border-l-[10px] border-r-[10px] border-b-[10px] 
                       border-transparent border-b-gray-200 z-0 
                       translate-y-px"
				/>
				<div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 min-w-[600px]">
					<div className="grid grid-cols-2 gap-8">
						<div className="space-y-6">
							<div>
								<h4 className="text-gray-800 mb-3">Global payments</h4>
								<div className="grid gap-y-2">
									<DropdownLink
										icon={CreditCard}
										name="Payments"
										description="Online payments"
									/>
									<DropdownLink
										icon={Store}
										name="Checkout"
										description="Hosted payments page"
									/>
									<DropdownLink
										icon={LayoutGrid}
										name="Elements"
										description="Customizable payments UIs"
									/>
								</div>
							</div>
						</div>
						<div className="space-y-6">
							<div>
								<h4 className="text-gray-800 mb-3">Financial services</h4>
								<div className="grid gap-y-2">
									<DropdownLink
										icon={Newspaper}
										name="Billing"
										description="Subscription management"
									/>
									<DropdownLink
										icon={Settings}
										name="Connect"
										description="Payments for platforms"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="col-span-2 mt-6 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="">Explore all products</h3>
								<p className="text-gray-500">
									View our full list of products and solutions
								</p>
							</div>
							<Button variant="ghost" className="gap-2">
								View all products
								<ArrowRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		),
	},
	{
		title: "Solutions",
		href: "#",
		mobileItems: [
			{ name: "SaaS", description: "Subscription businesses", icon: Globe },
			{
				name: "Platforms",
				description: "Marketplaces & platforms",
				icon: Store,
			},
			{ name: "Integration Solutions", description: "Custom solutions" },
		],
		dropdownContent: (
			<div className="relative">
				<div
					className="absolute -top-2.5 left-10 w-0 h-0 
                       border-l-[10px] border-r-[10px] border-b-[10px] 
                       border-transparent border-b-white z-10"
				/>
				<div
					className="absolute -top-2.5 left-10 w-0 h-0 
                       border-l-[10px] border-r-[10px] border-b-[10px] 
                       border-transparent border-b-gray-200 z-0 
                       translate-y-px"
				/>
				<div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 min-w-[500px]">
					<div className="grid grid-cols-2 gap-8">
						<div className="space-y-6">
							<div>
								<h4 className="text-gray-800 mb-3">By Industry</h4>
								<div className="grid gap-y-2">
									<DropdownLink
										icon={Globe}
										name="SaaS"
										description="Subscription businesses"
									/>
									<DropdownLink
										icon={Store}
										name="Platforms"
										description="Marketplaces & platforms"
									/>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 p-6 rounded-xl">
							<div className="space-y-4">
								<h3 className="">Integration and custom solutions</h3>
								<p className="text-sm text-gray-500">
									Learn how to customize Stripe to your business needs
								</p>
								<Button variant="ghost" className="gap-2">
									Contact sales
									<ArrowRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		),
	},
	{
		title: "Developers",
		href: "#",
		mobileItems: [
			{
				name: "Get Started",
				description: "Start integrating Stripe",
				icon: Rocket,
			},
			{
				name: "API Reference",
				description: "API documentation",
				icon: Globe,
			},
		],
		dropdownContent: (
			<div className="relative">
				<div
					className="absolute -top-2.5 left-10 w-0 h-0 
                       border-l-[10px] border-r-[10px] border-b-[10px] 
                       border-transparent border-b-white z-10"
				/>
				<div
					className="absolute -top-2.5 left-10 w-0 h-0 
                       border-l-[10px] border-r-[10px] border-b-[10px] 
                       border-transparent border-b-gray-200 z-0 
                       translate-y-px"
				/>
				<div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 min-w-[500px]">
					<div className="grid grid-cols-2 gap-8">
						<div>
							<h4 className="text-gray-800 mb-3">Documentation</h4>
							<div className="grid gap-y-2">
								<DropdownLink
									icon={Rocket}
									name="Get Started"
									description="Start integrating Stripe"
								/>
								<DropdownLink
									icon={Globe}
									name="API Reference"
									description="API documentation"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		),
	},
	{
		title: "Resources",
		href: "#",
		mobileItems: [
			{ name: "Support Center" },
			{ name: "Blog" },
			{ name: "Case Studies" },
		],
	},
	{
		title: "Pricing",
		href: "#",
	},
];

export function Navigation() {
	const [isOpen, setIsOpen] = React.useState(false);
	const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
		null,
	);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (activeDropdown && dropdownRef.current) {
			gsap.fromTo(
				dropdownRef.current,
				{
					opacity: 0,
					y: 10,
					scale: 0.95,
					transformOrigin: "top left",
				},
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.3,
					ease: "power2.out",
				},
			);
		}
	}, [activeDropdown]);

	const menuItems = React.useMemo(() => {
		return navItems.map((item) => ({
			label: item.title,
			href: item.href,
			subItems: item.mobileItems?.map((m) => ({ name: m.name, href: "#" })),
		}));
	}, []);

	return (
		<nav className="bg-transparent py-4 relative z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-8">
						<Link href="/" className="text-black text-2xl font-bold ">
							<span className="text-xl">
								<h1>Yawa</h1>
							</span>
						</Link>
						{/* Desktop Navigation */}
						<div className="hidden lg:flex lg:items-center lg:space-x-6"></div>
						{navItems.map((item) => (
							<div key={item.title} className="relative group">
								<Link
									href={item.href}
									className="text-black hover:text-gray-700 py-2 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
									onFocus={() => setActiveDropdown(item.title)}
									onBlur={() => setActiveDropdown(null)}
									onMouseEnter={() => setActiveDropdown(item.title)}
									onMouseLeave={() => setActiveDropdown(null)}
								>
									{item.title}
									{item.dropdownContent && (
										<ChevronDown className="h-4 w-4 transition-transform duration-200" />
									)}
								</Link>
								{item.dropdownContent && activeDropdown === item.title && (
									<div
										ref={dropdownRef}
										className="absolute top-full left-0 pt-2"
										role="menu"
										aria-labelledby={`${item.title}-label`}
									>
										{item.dropdownContent}
									</div>
								)}
							</div>
						))}
					</div>

					{/* Sign in and Contact sales */}
					<div className="hidden lg:flex items-center space-x-4">
						<Button
							variant="ghost"
							className="text-black hover:bg-green-300 group"
						>
							<span>Sign in</span>
							<span className="ml-1 group-hover:hidden">&gt;</span>
							<ArrowRight className="hidden h-4 w-4 ml-1 group-hover:block" />
						</Button>
						<Button className="bg-white text-black hover:bg-white/90">
							Contact sales
						</Button>
					</div>

					{/* Mobile Navigation */}
					<div className="lg:hidden flex items-center">
						<button
							type="button"
							className="open-offcanvas w-10 h-10 flex flex-col justify-center items-center gap-1.5 group"
							onClick={() => setIsOpen(true)}
							aria-label="Open menu"
						>
							<span className="w-6 h-0.5 bg-black transition-all group-hover:bg-yellow-400"></span>
							<span className="w-6 h-0.5 bg-black transition-all group-hover:bg-yellow-400"></span>
							<span className="w-6 h-0.5 bg-black transition-all group-hover:bg-yellow-400"></span>
						</button>

						<OffcanvasMenu
							isOpen={isOpen}
							onClose={() => setIsOpen(false)}
							menuItems={menuItems}
						/>
					</div>
				</div>
			</div>
		</nav>
	);
}

interface DropdownLinkProps {
	icon: React.ComponentType<{ size: number; className?: string }>;
	name: string;
	description: string;
}

function DropdownLink({ icon: Icon, name, description }: DropdownLinkProps) {
	return (
		<div className="group cursor-pointer">
			<div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
				<div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
					<Icon
						size={16}
						className="text-gray-600 group-hover:text-purple-600 group-hover:scale-110 transition-all duration-200"
					/>
				</div>
				<div className="flex flex-col">
					<span className="text-gray-900 group-hover:text-purple-600 transition-colors duration-200 font-medium">
						{name}
					</span>
					<span className="text-gray-500 text-sm">{description}</span>
				</div>
			</div>
		</div>
	);
}
<div className="border-b border-gray-600 w-full" />;
