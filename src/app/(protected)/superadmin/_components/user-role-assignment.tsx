"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
	id: string;
	email: string;
	roles: string[];
}

interface Role {
	id: string;
	name: string;
}

export default function UserRoleAssignment() {
	const [users, setUsers] = useState<User[]>([]);
	const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const fetchUsersAndRoles = useCallback(async () => {
		setIsLoading(true);
		try {
			const usersRes = await fetch("/api/user-role");
			if (!usersRes.ok) throw new Error("Failed to fetch users");
			const usersData = await usersRes.json();

			const rolesRes = await fetch("/api/superadmin/roles");
			if (!rolesRes.ok) throw new Error("Failed to fetch roles");
			const rolesData: Role[] = await rolesRes.json();

			setUsers(usersData.users || []);
			setAvailableRoles(rolesData);

			const initialRoles: Record<string, string[]> = {};
			(usersData.users || []).forEach((u: User) => {
				initialRoles[u.id] = u.roles;
			});
			setUserRoles(initialRoles);
		} catch (error) {
			toast.error("Failed to load users or roles");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsersAndRoles();
	}, [fetchUsersAndRoles]);

	const handleSelectUser = (userId: string) => {
		setSelectedUser(userId);
	};

	const toggleRole = (userId: string, role: string) => {
		setUserRoles((prev) => {
			const currentRoles = prev[userId] || [];
			return {
				...prev,
				[userId]: currentRoles.includes(role)
					? currentRoles.filter((r) => r !== role)
					: [...currentRoles, role],
			};
		});
	};

	const handleSaveRoles = async () => {
		if (!selectedUser) return;
		setIsSaving(true);
		try {
			const res = await fetch("/api/user-role", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: selectedUser,
					roles: userRoles[selectedUser],
				}),
			});
			if (!res.ok) throw new Error("Failed to save roles");

			// Update badges in user list
			setUsers((prev) =>
				prev.map((u) =>
					u.id === selectedUser ? { ...u, roles: userRoles[selectedUser] } : u,
				),
			);

			toast.success("Roles updated successfully");
		} catch (error) {
			toast.error("Failed to save roles");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>User Role Assignment</CardTitle>
				<CardDescription>Assign multiple roles to users</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="grid gap-6 md:grid-cols-2">
					{/* Users List */}
					<div className="space-y-3">
						<h3 className="font-medium">Users</h3>
						<div className="space-y-2 rounded-lg border p-3 max-h-96 overflow-y-auto">
							{users.map((user) => (
								<motion.button
									key={user.id}
									onClick={() => handleSelectUser(user.id)}
									whileHover={{ x: 4 }}
									className={`w-full text-left p-2 rounded transition-colors ${
										selectedUser === user.id
											? "bg-primary text-primary-foreground"
											: "hover:bg-muted"
									}`}
									disabled={isSaving}
								>
									<p className="text-sm font-medium">{user.email}</p>
									<div className="flex gap-1 mt-1 flex-wrap">
										{user.roles.map((role) => (
											<Badge key={role} size="sm" variant="secondary">
												{role}
											</Badge>
										))}
									</div>
								</motion.button>
							))}
						</div>
					</div>

					{/* Assign Roles */}
					{selectedUser && (
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="space-y-3"
						>
							<h3 className="font-medium">Assign Roles</h3>
							<div className="space-y-3 rounded-lg border p-4">
								{availableRoles.map((role) => (
									<div key={role.id} className="flex items-center space-x-2">
										<Checkbox
											id={role.id}
											checked={(userRoles[selectedUser] || []).includes(
												role.name,
											)}
											onCheckedChange={() =>
												toggleRole(selectedUser, role.name)
											}
											disabled={isSaving}
										/>
										<label
											htmlFor={role.id}
											className="font-medium capitalize cursor-pointer flex-1"
										>
											{role.name}
										</label>
									</div>
								))}
							</div>
							<Button
								className="w-full"
								onClick={handleSaveRoles}
								disabled={isSaving}
							>
								{isSaving ? "Saving..." : "Save Roles"}
							</Button>
						</motion.div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
