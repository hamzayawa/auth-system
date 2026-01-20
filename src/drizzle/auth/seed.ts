// src/drizzle/seed-rbac-core.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  permission,
  role,
  rolePermission,
  userRole,
} from "./schemas/rbac-schema";
import "dotenv/config";
import { eq, inArray } from "drizzle-orm";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

const defaultPermissions = [
  // User Management Permissions ✅
  { name: "user:create", category: "user", description: "Create new users" },
  { name: "user:read", category: "user", description: "View users" },
  { name: "user:update", category: "user", description: "Edit user details" }, // ✅ Fixed: edit → update
  { name: "user:delete", category: "user", description: "Delete users" },
  { name: "user:ban", category: "user", description: "Ban/unban users" },

  // Role Management Permissions ✅
  { name: "role:create", category: "role", description: "Create new roles" },
  { name: "role:read", category: "role", description: "View roles" },
  { name: "role:update", category: "role", description: "Edit roles" }, // ✅ Fixed: edit → update
  { name: "role:delete", category: "role", description: "Delete roles" },
  {
    name: "role:assign",
    category: "role",
    description: "Assign roles to users",
  },
  { name: "role:list", category: "role", description: "List all roles" }, // ✅ Added missing role:list

  // Permission Management Permissions ✅
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
    name: "permission:update",
    category: "permission",
    description: "Edit permissions",
  },
  {
    name: "permission:delete",
    category: "permission",
    description: "Delete permissions",
  },

  // Content Management Permissions ✅
  {
    name: "content:create",
    category: "content",
    description: "Create content",
  },
  { name: "content:read", category: "content", description: "View content" },
  { name: "content:update", category: "content", description: "Edit content" },
  {
    name: "content:delete",
    category: "content",
    description: "Delete content",
  },

  // Analytics Permissions ✅
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

  // Audit Log Permissions ✅
  { name: "audit:view", category: "audit", description: "View audit logs" },
];

const defaultRoles = [
  {
    name: "user",
    description: "Regular user with basic permissions",
    permissions: ["user:read", "content:read"], // ✅ Basic read access
  },
  {
    name: "admin",
    description:
      "Admin with extended permissions (no role/permission management)",
    permissions: [
      "user:create",
      "user:read",
      "user:update",
      "user:delete",
      "content:create",
      "content:read",
      "content:update",
      "content:delete",
      "role:read",
      "role:list", // ✅ Can view roles but not manage
      "analytics:view",
      "analytics:export",
    ],
  },
  {
    name: "superadmin",
    description: "Superadmin with FULL system access",
    permissions: [
      // ✅ ALL permissions
      "user:create",
      "user:read",
      "user:update",
      "user:delete",
      "user:ban",
      "role:create",
      "role:read",
      "role:update",
      "role:delete",
      "role:assign",
      "role:list",
      "permission:create",
      "permission:read",
      "permission:update",
      "permission:delete",
      "content:create",
      "content:read",
      "content:update",
      "content:delete",
      "analytics:view",
      "analytics:export",
      "audit:view",
    ],
  },
];

export async function seedDefaultRolesAndPermissions() {
  console.log("🌱 Starting RBAC seeding...");

  try {
    // 1. Seed ALL permissions first
    console.log("  📋 Seeding permissions...");
    await db
      .insert(permission)
      .values(
        defaultPermissions.map((p) => ({
          id: `perm-${p.name.replace(/[:.]/g, "-")}`,
          ...p,
        })),
      )
      .onConflictDoNothing();

    // 2. Verify permissions exist
    const allPermissions = await db.query.permission.findMany();
    console.log(`  ✅ Found ${allPermissions.length} permissions`);

    // 3. Seed roles
    console.log("  👑 Seeding roles...");
    for (const r of defaultRoles) {
      // Insert role (or skip if exists)
      const [newRole] = await db
        .insert(role)
        .values({
          id: `role-${r.name}`, // ✅ Fixed IDs for consistency
          name: r.name,
          description: r.description,
        })
        .onConflictDoNothing()
        .returning();

      const roleRow =
        newRole ??
        (
          await db
            .select({ id: role.id })
            .from(role)
            .where(eq(role.name, r.name))
            .limit(1)
        )[0];

      console.log(`    👤 Created/Found role: ${r.name} (${roleRow.id})`);

      // 4. Link role → permissions
      const rolePerms = await db
        .select({ id: permission.id })
        .from(permission)
        .where(inArray(permission.name, r.permissions));

      for (const permRow of rolePerms) {
        await db
          .insert(rolePermission)
          .values({
            roleId: roleRow.id,
            permissionId: permRow.id,
          })
          .onConflictDoNothing();
      }

      console.log(`    🔗 Linked ${rolePerms.length} permissions to ${r.name}`);
    }

    // 5. Verify final state
    const finalRoles = await db.query.role.findMany({
      with: {
        rolePermissions: {
          with: {
            permission: true,
          },
        },
      },
    });

    console.log("\n📊 FINAL RBAC STATE:");
    finalRoles.forEach((r) => {
      const permCount = r.rolePermissions?.length || 0;
      console.log(`  ${r.name}: ${permCount} permissions`);
    });

    console.log("\n✅ RBAC seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
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

// Export for script usage
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => process.exit(0));
}
