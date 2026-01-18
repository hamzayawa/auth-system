"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type AuditLog = {
	id: string;
	userId: string;
	action: string;
	entityType: string;
	entityId: string;
	createdAt: Date;
};

function getActionColor(action: string) {
	if (action.includes("CREATE") || action.includes("ASSIGN")) {
		return "bg-green-100 text-green-800";
	}
	if (action.includes("DELETE")) {
		return "bg-red-100 text-red-800";
	}
	if (action.includes("EDIT") || action.includes("UPDATE")) {
		return "bg-blue-100 text-blue-800";
	}
	return "bg-gray-100 text-gray-800";
}

export default function AuditLogs({ logs }: { logs: AuditLog[] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Audit Logs</CardTitle>
				<CardDescription>
					Track all system changes and user actions
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="space-y-3">
					{logs.map((log, index) => (
						<motion.div
							key={log.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
						>
							<div className="flex-1">
								<p className="font-medium text-sm">{log.userId}</p>
								<p className="text-xs text-muted-foreground">
									{formatDistanceToNow(new Date(log.createdAt), {
										addSuffix: true,
									})}
								</p>
							</div>

							<Badge className={getActionColor(log.action)}>{log.action}</Badge>

							<Badge variant="outline">
								{log.entityType}:{log.entityId}
							</Badge>
						</motion.div>
					))}

					{logs.length === 0 && (
						<p className="text-sm text-muted-foreground text-center py-6">
							No audit logs found
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
