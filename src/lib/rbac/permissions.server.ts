// permissions.server.ts
import "server-only";
import { buildUserPermissionObject } from "./permission-builder";

export async function canExecuteAction(
	userId: string,
	requiredStatement: Record<string, string[]>,
): Promise<boolean> {
	const userPermissions = await buildUserPermissionObject(userId);

	// manual RBAC check
	for (const key in requiredStatement) {
		const requiredActions = requiredStatement[key];
		const allowedActions = userPermissions[key] ?? [];
		if (!requiredActions.every((a) => allowedActions.includes(a))) {
			return false;
		}
	}

	return true;
}
