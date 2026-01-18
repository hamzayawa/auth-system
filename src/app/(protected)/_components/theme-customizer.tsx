"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "./providers/theme-provider";

export function ThemeCustomizer() {
	const { theme, setTheme } = useTheme();
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		setMounted(true);
		setIsDarkMode(theme.scheme === "dark");
	}, [theme.scheme]);

	// Force light theme for the customizer when app is in dark mode
	const customizerThemeClass = theme.scheme === "dark" ? "light" : theme.scheme;

	const handleLayoutChange = (value: "vertical" | "horizontal") => {
		if (theme.layout !== value) {
			setTheme({ ...theme, layout: value });
			localStorage.setItem("layout", value);
			setOpen(false);
		}
	};

	if (!mounted) {
		return (
			<div className="fixed right-0 bottom-4">
				<div className="h-12 w-12 rounded-full shadow-lg bg-gray-200 animate-pulse" />
			</div>
		);
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<motion.div
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					className="fixed right-0 bottom-4"
				>
					<Button
						variant="outline"
						size="icon"
						className={`
              h-12 w-12 rounded-full border-r-0 shadow-xl ring-2 ring-offset-2
              transition-all duration-300 backdrop-blur-sm
              ${
								isDarkMode
									? "bg-white/95 border-white/60 text-gray-300 ring-white/50 hover:bg-white hover:border-white hover:shadow-2xl hover:ring-white"
									: "bg-slate-900/95 border-slate-700 text-white ring-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:shadow-2xl hover:ring-slate-600/75"
							}
            `}
					>
						<Settings className="h-6 w-6" />
					</Button>
				</motion.div>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="w-[420px] border-l p-6"
				// Force light theme for the entire sheet content
				data-theme={customizerThemeClass}
			>
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
				>
					<SheetHeader className="space-y-2.5">
						<SheetTitle>Theme Customizer</SheetTitle>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<motion.div
							className="space-y-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
						>
							<Label>Layout</Label>
							<RadioGroup
								value={theme.layout}
								onValueChange={handleLayoutChange}
								className="grid grid-cols-2 gap-2"
							>
								<div>
									<RadioGroupItem
										value="vertical"
										id="vertical"
										className="peer sr-only"
									/>
									<Label
										htmlFor="vertical"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Vertical</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-background p-1">
											<div className="mx-auto h-full w-4/5 rounded-sm bg-muted" />
										</div>
									</Label>
								</div>
								<div>
									<RadioGroupItem
										value="horizontal"
										id="horizontal"
										className="peer sr-only"
									/>
									<Label
										htmlFor="horizontal"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Horizontal</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-background p-1">
											<div className="mx-auto h-full w-4/5 rounded-sm bg-muted" />
										</div>
									</Label>
								</div>
							</RadioGroup>
						</motion.div>

						<motion.div
							className="space-y-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.15 }}
						>
							<Label>Color Scheme</Label>
							<RadioGroup
								value={theme.scheme}
								onValueChange={(value: "light" | "dark") =>
									setTheme({ ...theme, scheme: value })
								}
								className="grid grid-cols-2 gap-2"
							>
								<div>
									<RadioGroupItem
										value="light"
										id="light"
										className="peer sr-only"
									/>
									<Label
										htmlFor="light"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Light</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-background p-1 shadow-sm" />
									</Label>
								</div>
								<div>
									<RadioGroupItem
										value="dark"
										id="dark"
										className="peer sr-only"
									/>
									<Label
										htmlFor="dark"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Dark</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-card/80 dark:bg-slate-900 p-1 shadow-sm" />
									</Label>
								</div>
							</RadioGroup>
						</motion.div>

						<motion.div
							className="space-y-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<Label>Layout Width</Label>
							<RadioGroup
								value={theme.width}
								onValueChange={(value: "fluid" | "boxed") =>
									setTheme({ ...theme, width: value })
								}
								className="grid grid-cols-2 gap-2"
							>
								<div>
									<RadioGroupItem
										value="fluid"
										id="fluid"
										className="peer sr-only"
									/>
									<Label
										htmlFor="fluid"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Fluid</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-background p-1">
											<div className="h-full w-full rounded-sm bg-muted" />
										</div>
									</Label>
								</div>
								<div>
									<RadioGroupItem
										value="boxed"
										id="boxed"
										className="peer sr-only"
									/>
									<Label
										htmlFor="boxed"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Boxed</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-background p-1">
											<div className="mx-auto h-full w-4/5 rounded-sm bg-muted" />
										</div>
									</Label>
								</div>
							</RadioGroup>
						</motion.div>

						<motion.div
							className="space-y-2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.25 }}
						>
							<Label>Layout Position</Label>
							<RadioGroup
								value={theme.position}
								onValueChange={(value: "fixed" | "scrollable") =>
									setTheme({ ...theme, position: value })
								}
								className="grid grid-cols-2 gap-2"
							>
								<div>
									<RadioGroupItem
										value="fixed"
										id="fixed"
										className="peer sr-only"
									/>
									<Label
										htmlFor="fixed"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Fixed</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-background p-1">
											<div className="h-full w-full rounded-sm bg-muted" />
										</div>
									</Label>
								</div>
								<div>
									<RadioGroupItem
										value="scrollable"
										id="scrollable"
										className="peer sr-only"
									/>
									<Label
										htmlFor="scrollable"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 backdrop-blur-sm p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
									>
										<div className="mb-2">Scrollable</div>
										<div className="h-12 w-full rounded-sm border-2 border-muted bg-background p-1">
											<div className="h-full w-full rounded-sm bg-muted" />
										</div>
									</Label>
								</div>
							</RadioGroup>
						</motion.div>
					</div>
				</motion.div>
			</SheetContent>
		</Sheet>
	);
}
