import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { permission, role, rolePermission } from "./schemas/rbac-schema";
import "dotenv/config";
import { eq, inArray } from "drizzle-orm";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

const defaultPermissions = [
	// User Management Permissions
	{ name: "user:create", category: "user", description: "Create new users" },
	{ name: "user:read", category: "user", description: "View users" },
	{ name: "user:edit", category: "user", description: "Edit user details" },
	{ name: "user:delete", category: "user", description: "Delete users" },
	{ name: "user:ban", category: "user", description: "Ban/unban users" },

	// Role Management Permissions
	{ name: "role:create", category: "role", description: "Create new roles" },
	{ name: "role:read", category: "role", description: "View roles" },
	{ name: "role:edit", category: "role", description: "Edit roles" },
	{ name: "role:delete", category: "role", description: "Delete roles" },
	{
		name: "role:assign",
		category: "role",
		description: "Assign roles to users",
	},

	// Permission Management Permissions
	{
		name: "permission:create",
		category: "permission",
		description: "Create new permissions",
	},
	{
		name: "permission:read",
		category: "permission",
		description: "View permissions",
	},
	{
		name: "permission:edit",
		category: "permission",
		description: "Edit permissions",
	},
	{
		name: "permission:delete",
		category: "permission",
		description: "Delete permissions",
	},

	// Content Management Permissions
	{
		name: "content:create",
		category: "content",
		description: "Create content",
	},
	{
		name: "content:read",
		category: "content",
		description: "View content",
	},
	{
		name: "content:edit",
		category: "content",
		description: "Edit content",
	},
	{
		name: "content:delete",
		category: "content",
		description: "Delete content",
	},

	// Analytics Permissions
	{
		name: "analytics:view",
		category: "analytics",
		description: "View analytics and reports",
	},
	{
		name: "analytics:export",
		category: "analytics",
		description: "Export analytics data",
	},

	// Audit Log Permissions
	{
		name: "audit:view",
		category: "audit",
		description: "View audit logs",
	},
];

const defaultRoles = [
	{
		name: "user",
		description: "Regular user with basic permissions",
		permissions: ["user:read", "content:read"],
	},
	{
		name: "admin",
		description: "Admin with extended permissions",
		permissions: [
			"user:create",
			"user:read",
			"user:edit",
			"user:delete",
			"content:create",
			"content:read",
			"content:edit",
			"content:delete",
			"analytics:view",
			"analytics:export",
		],
	},
	{
		name: "superadmin",
		description: "Superadmin with full permissions",
		permissions: [
			"user:create",
			"user:read",
			"user:edit",
			"user:delete",
			"user:ban",
			"role:create",
			"role:read",
			"role:edit",
			"role:delete",
			"role:assign",
			"permission:create",
			"permission:read",
			"permission:edit",
			"permission:delete",
			"content:create",
			"content:read",
			"content:edit",
			"content:delete",
			"analytics:view",
			"analytics:export",
			"audit:view",
		],
	},
];

export async function seedDefaultRolesAndPermissions() {
	console.log("🌱 Seeding permissions...");

	// Seed permissions
	for (const perm of defaultPermissions) {
		await db.insert(permission).values(perm).onConflictDoNothing();
	}

	console.log("🌱 Seeding roles...");

	// Seed roles with permissions
	for (const r of defaultRoles) {
		const [newRole] = await db
			.insert(role)
			.values({ name: r.name, description: r.description })
			.onConflictDoNothing()
			.returning();

		const perms = await db
			.select({ id: permission.id })
			.from(permission)
			.where(inArray(permission.name, r.permissions)); // ✅ Uses inArray

		const roleRow =
			newRole ??
			(
				await db
					.select({ id: role.id })
					.from(role)
					.where(eq(role.name, r.name)) // ✅ Uses eq
					.limit(1)
			)[0];

		for (const permRow of perms) {
			await db
				.insert(rolePermission)
				.values({ roleId: roleRow.id, permissionId: permRow.id })
				.onConflictDoNothing();
		}
	}

	console.log("✅ Seeded default roles and permissions");
}

async function main() {
	try {
		await seedDefaultRolesAndPermissions();
	} catch (error) {
		console.error("❌ Seed failed:", error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

main().then(() => process.exit(0));
