import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

// Roles table
export const role = pgTable("role", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Permissions table
export const permission = pgTable("permission", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull().unique(),
	description: text("description"),
	category: text("category").notNull(), // e.g., "user", "content", "role", "analytics"
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Role-Permission junction table (many-to-many)
export const rolePermission = pgTable(
	"role_permission",
	{
		roleId: text("role_id")
			.notNull()
			.references(() => role.id, { onDelete: "cascade" }),
		permissionId: text("permission_id")
			.notNull()
			.references(() => permission.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

// User-Role junction table (many-to-many)
export const userRole = pgTable(
	"user_role",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		roleId: text("role_id")
			.notNull()
			.references(() => role.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);

// Audit logs table
export const auditLog = pgTable("audit_log", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "set null" }),
	action: text("action").notNull(), // e.g., "CREATE_ROLE", "ASSIGN_PERMISSION", "ASSIGN_USER_ROLE"
	entityType: text("entity_type").notNull(), // e.g., "role", "permission", "user"
	entityId: text("entity_id").notNull(),
	description: text("description"),
	changes: text("changes"), // JSON stringified changes
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const roleRelations = relations(role, ({ many }) => ({
	permissions: many(rolePermission),
	users: many(userRole),
}));

export const permissionRelations = relations(permission, ({ many }) => ({
	roles: many(rolePermission),
}));

export const rolePermissionRelations = relations(rolePermission, ({ one }) => ({
	role: one(role, {
		fields: [rolePermission.roleId],
		references: [role.id],
	}),
	permission: one(permission, {
		fields: [rolePermission.permissionId],
		references: [permission.id],
	}),
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
	user: one(user, {
		fields: [userRole.userId],
		references: [user.id],
	}),
	role: one(role, {
		fields: [userRole.roleId],
		references: [role.id],
	}),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
	user: one(user, {
		fields: [auditLog.userId],
		references: [user.id],
	}),
}));
