import { eq, inArray } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
  permission,
  role,
  rolePermission,
  userRole,
} from "@/drizzle/schemas/rbac-schema";
import { buildPermissionObject } from "./permission-utils";

/**
 * Get all permissions for a user by fetching their roles and role permissions from DB.
 * This happens at session/request time to ensure dynamic updates.
 */
export async function getUserPermissionsFromDB(userId: string): Promise<
  Array<{
    resource: string;
    action: string;
    roleId: string;
    roleName: string;
  }>
> {
  try {
    // Get user's roles
    const userRoles = await db
      .select({ roleId: role.id })
      .from(role)
      .innerJoin(userRole, eq(userRole.roleId, role.id))
      .where(eq(userRole.userId, userId));

    if (userRoles.length === 0) return [];

    const roleIds = userRoles.map((ur) => ur.roleId);

    // Get permissions WITH role names via SQL
    return await db
      .select({
        resource: permission.category,
        action: permission.name,
        roleId: role.id,
        roleName: role.name,
      })
      .from(permission)
      .innerJoin(rolePermission, eq(rolePermission.permissionId, permission.id))
      .innerJoin(role, eq(role.id, rolePermission.roleId))
      .where(inArray(role.id, roleIds));
  } catch (error) {
    console.error("[RBAC] Error fetching user permissions from DB:", error);
    return [];
  }
}

/**
 * Build runtime permission object from user's database roles and permissions.
 * This replaces hardcoded role definitions with dynamic DB queries.
 */
export async function buildUserPermissionObject(userId: string) {
  const dbPermissions = await getUserPermissionsFromDB(userId);

  console.log(
    "🔍 RAW DB PERMISSIONS:",
    dbPermissions.map((p) => ({
      resource: p.resource,
      action: p.action,
    })),
  );

  const mapped = dbPermissions
    .map((p) => {
      let action = p.action.split(":")[1] || p.action.split(".")[1];

      // 👈 DEBUG: Log before/after mapping
      console.log(`🔄 MAPPING: ${p.action} → ${action}`);

      // Map edit → update
      if (action === "edit") {
        action = "update";
        console.log("✅ MAPPED edit → update");
      }

      return action ? { resource: p.resource, action } : null;
    })
    .filter(Boolean) as Array<{ resource: string; action: string }>;

  console.log("🔍 FINAL MAPPED:", mapped);
  console.log(
    "🔍 HAS role.update?",
    mapped.some((p) => p.resource === "role" && p.action === "update"),
  );

  const result = buildPermissionObject(mapped);
  console.log("🔍 FINAL OBJECT:", result);

  return result;
}

/**
 * Get detailed permission info with role sources (for UI display).
 * Useful for superadmin to see where permissions come from.
 */
export async function getUserPermissionsWithRoles(userId: string): Promise<
  Array<{
    resource: string;
    action: string;
    roles: Array<{ id: string; name: string }>;
  }>
> {
  const dbPermissions = await getUserPermissionsFromDB(userId);

  // Group by resource and action
  const grouped = dbPermissions.reduce<
    Record<
      string,
      {
        resource: string;
        action: string;
        roles: Array<{ id: string; name: string }>;
      }
    >
  >((acc, perm) => {
    const key = `${perm.resource}:${perm.action}`;

    if (!acc[key]) {
      acc[key] = {
        resource: perm.resource,
        action: perm.action,
        roles: [],
      };
    }

    // Add role if not already added
    if (!acc[key].roles.find((r) => r.id === perm.roleId)) {
      acc[key].roles.push({
        id: perm.roleId,
        name: perm.roleName,
      });
    }

    return acc;
  }, {});

  return Object.values(grouped);
}

/**
 * Get all available permissions in the system.
 * Used by superadmin UI to display and manage permissions.
 */
export async function getPermissions() {
  try {
    const permissions = await db.select().from(permission);
    return permissions;
  } catch (error) {
    console.error("[RBAC] Error fetching permissions:", error);
    return [];
  }
}
