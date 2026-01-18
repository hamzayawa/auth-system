import "server-only";

import { buildUserPermissionObject } from "@/lib/rbac/permission-builder";
import { getUserRoles } from "@/lib/rbac/roles";
import { auth } from "./auth";

export async function getSessionWithRolesAndPermissions() {
	const session = await auth.api.getSession();

	if (!session?.user?.id) {
		return null;
	}

	const roles = await getUserRoles(session.user.id);
	const permissionObject = await buildUserPermissionObject(session.user.id);

	return {
		...session,
		user: {
			...session.user,
			roles: roles.map((r) => r.name),
			permissionObject,
		},
	};
}

export function getUserDashboardRoute(userRoles: string[]): string {
	if (userRoles.includes("superadmin")) {
		return "/superadmin";
	}
	if (userRoles.includes("admin")) {
		return "/admin";
	}
	return "/dashboard";
}
