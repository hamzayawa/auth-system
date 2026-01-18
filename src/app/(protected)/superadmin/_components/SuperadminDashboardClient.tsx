"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuditLogs from "./audit-logs";
import PermissionManagement from "./permission-management";
import RoleManagement from "./role-management";
import UserRoleAssignment from "./user-role-assignment";

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

interface Props {
	logs: any[];
}

export default function SuperadminDashboardClient({ logs }: Props) {
	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="show"
			className="space-y-6"
		>
			{/* Header */}
			<motion.div variants={itemVariants}>
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">
						Superadmin Dashboard
					</h1>
					<p className="text-muted-foreground">
						Manage roles, permissions, users, and view audit logs
					</p>
				</div>
			</motion.div>

			{/* Tabs */}
			<motion.div variants={itemVariants}>
				<Tabs defaultValue="roles" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="roles">Roles</TabsTrigger>
						<TabsTrigger value="permissions">Permissions</TabsTrigger>
						<TabsTrigger value="users">User Roles</TabsTrigger>
						<TabsTrigger value="audit">Audit Logs</TabsTrigger>
					</TabsList>

					<TabsContent value="roles" className="space-y-4">
						<RoleManagement />
					</TabsContent>

					<TabsContent value="permissions" className="space-y-4">
						<PermissionManagement
							initialSelected={["user:read", "role:assign"]}
						/>
					</TabsContent>

					<TabsContent value="users" className="space-y-4">
						<UserRoleAssignment />
					</TabsContent>

					<TabsContent value="audit" className="space-y-4">
						<AuditLogs logs={logs} />
					</TabsContent>
				</Tabs>
			</motion.div>
		</motion.div>
	);
}
