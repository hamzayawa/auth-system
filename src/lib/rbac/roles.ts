import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
  permission,
  role,
  rolePermission,
  userRole,
} from "@/drizzle/schemas/rbac-schema";

export async function createRole(
  name: string,
  description?: string,
  permissionIds: string[] = [],
) {
  // 1. Check if role exists (handles "Lecturer" gracefully)
  const existing = await db.query.role.findFirst({
    where: eq(role.name, name.trim()),
  });

  if (existing) {
    console.log(`✅ Role "${name}" exists - updating permissions`);
    if (permissionIds.length > 0) {
      await assignPermissionsToRole(existing.id, permissionIds);
    }
    return existing;
  }

  // 2. Create NEW role (YOUR schema auto-generates ID)
  const [newRole] = await db
    .insert(role)
    .values({
      name: name.trim(),
      description: description?.trim(),
    })
    .returning();

  // 3. Assign permissions
  if (permissionIds.length > 0) {
    await assignPermissionsToRole(newRole.id, permissionIds);
  }

  return newRole;
}

export async function updateRole(
  roleId: string,
  name: string,
  description?: string,
) {
  const [updated] = await db
    .update(role)
    .set({
      name: name.trim(),
      description: description?.trim(),
      updatedAt: new Date(), // Update timestamp
    })
    .where(eq(role.id, roleId))
    .returning();

  if (!updated) {
    throw new Error("Role not found");
  }

  return updated;
}

export async function deleteRole(roleId: string) {
  // Delete role permissions
  await db.delete(rolePermission).where(eq(rolePermission.roleId, roleId));

  // Delete user roles
  await db.delete(userRole).where(eq(userRole.roleId, roleId));

  // Delete role
  await db.delete(role).where(eq(role.id, roleId));
}

export async function getRoles() {
  return db.select().from(role);
}

export async function getRoleById(roleId: string) {
  const [result] = await db.select().from(role).where(eq(role.id, roleId));

  return result;
}

export async function getRoleWithPermissions(roleId: string) {
  const roleData = await getRoleById(roleId);

  if (!roleData) return null;

  const permissions = await db
    .select({ id: permission.id, name: permission.name })
    .from(permission)
    .innerJoin(rolePermission, eq(rolePermission.permissionId, permission.id))
    .where(eq(rolePermission.roleId, roleId));

  return {
    ...roleData,
    permissions,
  };
}

export async function assignPermissionsToRole(
  roleId: string,
  permissionIds: string[],
) {
  // Clear existing permissions
  await db.delete(rolePermission).where(eq(rolePermission.roleId, roleId));

  // Add new permissions
  if (permissionIds.length > 0) {
    await db.insert(rolePermission).values(
      permissionIds.map((pid) => ({
        roleId,
        permissionId: pid,
      })),
    );
  }
}

export async function assignRoleToUser(userId: string, roleId: string) {
  const [result] = await db
    .insert(userRole)
    .values({ userId, roleId })
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  await db
    .delete(userRole)
    .where(and(eq(userRole.userId, userId), eq(userRole.roleId, roleId)));
}

export async function getUserRoles(userId: string) {
  return db
    .select({ id: role.id, name: role.name, description: role.description })
    .from(role)
    .innerJoin(userRole, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, userId));
}
