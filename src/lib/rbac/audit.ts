import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { auditLog } from "@/drizzle/schemas/rbac-schema";

export async function logAuditEvent(
	userId: string,
	action: string,
	entityType: string,
	entityId: string,
	description?: string,
	changes?: Record<string, any>,
	ipAddress?: string,
	userAgent?: string,
) {
	await db.insert(auditLog).values({
		userId,
		action,
		entityType,
		entityId,
		description,
		changes: changes ? JSON.stringify(changes) : undefined,
		ipAddress,
		userAgent,
	});
}

export async function getAuditLogs(limit = 50, offset = 0) {
	return db
		.select()
		.from(auditLog)
		.orderBy((t) => t.createdAt)
		.limit(limit)
		.offset(offset);
}

export async function getAuditLogsByUser(userId: string, limit = 50) {
	return db
		.select()
		.from(auditLog)
		.where(eq(auditLog.userId, userId))
		.orderBy((t) => t.createdAt)
		.limit(limit);
}

export async function getAuditLogsByEntity(
	entityType: string,
	entityId: string,
) {
	return db
		.select()
		.from(auditLog)
		.where(
			and(eq(auditLog.entityType, entityType), eq(auditLog.entityId, entityId)),
		)
		.orderBy((t) => t.createdAt);
}
