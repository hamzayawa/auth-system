"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "./analytics";
import ContentManagement from "./content-management";
import UserManagement from "./user-management";

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="space-y-6"
		>
			<motion.div variants={itemVariants}>
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage users, content, and view analytics
					</p>
				</div>
			</motion.div>

			<motion.div variants={itemVariants}>
				<Tabs defaultValue="users" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="users">Users</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="analytics">Analytics</TabsTrigger>
					</TabsList>

					<TabsContent value="users" className="space-y-4">
						<UserManagement />
					</TabsContent>

					<TabsContent value="content" className="space-y-4">
						<ContentManagement />
					</TabsContent>

					<TabsContent value="analytics" className="space-y-4">
						<Analytics />
					</TabsContent>
				</Tabs>
			</motion.div>
		</motion.div>
	);
}
