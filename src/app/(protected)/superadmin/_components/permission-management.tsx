"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Permission {
	id: string;
	name: string;
	category: string;
}

interface PermissionManagementProps {
	initialSelected?: string[];
}

export default function PermissionManagement({
	initialSelected = [],
}: PermissionManagementProps) {
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [selectedPermissions, setSelectedPermissions] =
		useState<string[]>(initialSelected);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const fetchPermissions = async () => {
			setIsLoading(true);
			try {
				const res = await fetch("/api/superadmin/permissions");
				if (!res.ok) throw new Error("Failed to fetch permissions");

				const data: Permission[] = await res.json();
				setPermissions(data);
			} catch (error) {
				toast.error("Failed to load permissions");
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchPermissions();
	}, []);

	const togglePermission = (permissionId: string) => {
		setSelectedPermissions((prev) =>
			prev.includes(permissionId)
				? prev.filter((id) => id !== permissionId)
				: [...prev, permissionId],
		);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			// For now we just log; later you can POST to an endpoint
			console.log("Permissions to save:", selectedPermissions);
			toast.success("Permissions updated successfully");
		} catch (error) {
			toast.error("Failed to save permissions");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	// Group permissions by category dynamically
	const groupedPermissions = permissions.reduce<Record<string, Permission[]>>(
		(acc, perm) => {
			if (!acc[perm.category]) acc[perm.category] = [];
			acc[perm.category].push(perm);
			return acc;
		},
		{},
	);

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
				<CardTitle>Permission Management</CardTitle>
				<CardDescription>
					Manage system permissions and assign them to roles
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-6">
					{Object.entries(groupedPermissions).map(([category, perms], idx) => (
						<motion.div
							key={category}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.05 }}
						>
							<h3 className="font-semibold capitalize mb-2">
								{category} Permissions
							</h3>
							<div className="space-y-2 rounded-lg border p-4">
								{perms.map((perm) => (
									<div key={perm.id} className="flex items-center space-x-2">
										<Checkbox
											id={perm.id}
											checked={selectedPermissions.includes(perm.id)}
											onCheckedChange={() => togglePermission(perm.id)}
											disabled={isSaving}
										/>
										<Label
											htmlFor={perm.id}
											className="font-normal cursor-pointer"
										>
											{perm.name}
										</Label>
									</div>
								))}
							</div>
						</motion.div>
					))}

					<Button className="w-full" onClick={handleSave} disabled={isSaving}>
						{isSaving ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Save Permissions
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
