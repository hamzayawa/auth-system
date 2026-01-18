"use client";

import { motion } from "framer-motion";
import { Ban, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function UserManagement() {
	const [users] = useState([
		{
			id: "1",
			email: "user1@example.com",
			name: "User One",
			status: "active",
			joinedAt: "2024-01-15",
		},
		{
			id: "2",
			email: "user2@example.com",
			name: "User Two",
			status: "active",
			joinedAt: "2024-01-20",
		},
		{
			id: "3",
			email: "user3@example.com",
			name: "User Three",
			status: "banned",
			joinedAt: "2024-01-10",
		},
	]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							User Management
						</CardTitle>
						<CardDescription>
							Create, edit, and manage user accounts
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<Input type="search" placeholder="Search users by email or name..." />

				<div className="space-y-2">
					{users.map((user, index) => (
						<motion.div
							key={user.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
						>
							<div className="flex-1">
								<p className="font-medium">{user.name}</p>
								<p className="text-sm text-muted-foreground">{user.email}</p>
								<p className="text-xs text-muted-foreground mt-1">
									Joined {user.joinedAt}
								</p>
							</div>

							<div className="flex items-center gap-3">
								<Badge
									variant={user.status === "active" ? "default" : "destructive"}
								>
									{user.status}
								</Badge>
								<div className="flex gap-2">
									<Button size="sm" variant="ghost">
										Edit
									</Button>
									<Button size="sm" variant="ghost">
										<Ban className="h-4 w-4" />
									</Button>
									<Button
										size="sm"
										variant="ghost"
										className="text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
