// lib/rbac/access-control.ts
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { canExecuteAction } from "@/lib/rbac/permissions.server";
import { buildUserPermissionObject } from "@/lib/rbac/permission-builder";
import { getUserRoles } from "@/lib/rbac/roles";

/**
 * INTERNAL: Resolve session + roles + permissions (API ONLY)
 */
export async function getSessionWithAccess(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user?.id) return null;

	const roles = await getUserRoles(session.user.id);
	const permissionObject = await buildUserPermissionObject(session.user.id);

	return {
		...session,
		user: {
			...session.user,
			roles: roles?.map((r) => r.name) ?? [], // <-- always an array
			permissionObject,
		},
	};
}

/**
 * Require authenticated user (API)
 */
export async function requireAuth(request: NextRequest) {
	const session = await getSessionWithAccess(request);
	if (!session) {
		throw new Error("Unauthorized");
	}
	return session;
}

/**
 * Require role (API)
 */
export async function requireRole(
	request: NextRequest,
	role: string | string[],
) {
	const session = await requireAuth(request);

	const required = Array.isArray(role) ? role : [role];
	const hasRole = required.some((r) => session.user.roles.includes(r));

	if (!hasRole) {
		throw new Error("Forbidden");
	}

	return session;
}

/**
 * Require permission (RBAC)
 */
export async function requirePermission(
	request: NextRequest,
	statement: Record<string, string[]>,
) {
	const session = await requireAuth(request);

	const allowed = await canExecuteAction(session.user.id, statement);
	if (!allowed) {
		throw new Error("Forbidden");
	}

	return session;
}
