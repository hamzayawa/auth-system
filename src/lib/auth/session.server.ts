import { auth } from "@/lib/auth/auth";
import { getUserRoles } from "@/lib/rbac/roles";
import { buildUserPermissionObject } from "@/lib/rbac/permission-builder";

export async function getSessionWithRoles(headers: Headers) {
	const session = await auth.api.getSession({ headers });

	if (!session?.user?.id) return null;

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
