"use client";

import { motion } from "framer-motion";
import { Edit2, FileText, Plus, Trash2 } from "lucide-react";
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

export default function ContentManagement() {
	const [content] = useState([
		{
			id: "1",
			title: "Getting Started Guide",
			author: "Admin",
			status: "published",
			createdAt: "2024-01-15",
			views: 234,
		},
		{
			id: "2",
			title: "API Documentation",
			author: "Developer",
			status: "draft",
			createdAt: "2024-01-20",
			views: 0,
		},
		{
			id: "3",
			title: "FAQ Section",
			author: "Support",
			status: "published",
			createdAt: "2024-01-10",
			views: 567,
		},
	]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Content Management
						</CardTitle>
						<CardDescription>Create, edit, and publish content</CardDescription>
					</div>
					<Button size="sm">
						<Plus className="mr-2 h-4 w-4" />
						New Content
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<Input type="search" placeholder="Search content..." />

				<div className="space-y-2">
					{content.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
						>
							<div className="flex-1">
								<p className="font-medium">{item.title}</p>
								<div className="flex gap-2 mt-1 text-sm text-muted-foreground">
									<span>By {item.author}</span>
									<span>•</span>
									<span>{item.views} views</span>
									<span>•</span>
									<span>{item.createdAt}</span>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Badge
									variant={
										item.status === "published" ? "default" : "secondary"
									}
								>
									{item.status}
								</Badge>
								<div className="flex gap-2">
									<Button size="sm" variant="ghost">
										<Edit2 className="h-4 w-4" />
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
