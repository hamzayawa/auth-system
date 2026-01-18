// lib/rbac/permissions.client.ts
import { ac } from "./permissions";

export function canExecuteActionSync(
	userPermissions: Record<string, string[]>,
	requiredStatement: Record<string, string[]>,
): boolean {
	const result = (ac as any).can(userPermissions, requiredStatement);
	return result.access === "ALLOW";
}
