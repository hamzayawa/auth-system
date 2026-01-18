import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

/**
 * Define WHAT permissions exist in the system.
 * This file is SAFE to import in the client.
 */
export const ac = createAccessControl({
	...defaultStatements,

	user: ["list", "read", "create", "update", "delete", "set-password"],
	role: ["list", "read", "create", "update", "delete", "assign"],
	permission: ["list", "read", "assign", "revoke"],
	content: ["list", "read", "create", "update", "delete", "publish"],
	analytics: ["view", "export"],
	audit: ["view"],
} as const);

export type PermissionStatement = typeof ac.statements;

/**
 * Pre-defined permission statements.
 */
export const requiredPermissions = {
	viewUsers: { user: ["list", "read"] },
	createUser: { user: ["create"] },
	editUser: { user: ["update"] },
	deleteUser: { user: ["delete"] },
	setUserPassword: { user: ["set-password"] },

	manageRoles: {
		role: ["list", "read", "create", "update", "delete", "assign"],
	},
	viewRoles: { role: ["list", "read"] },

	publishContent: { content: ["publish"] },
	fullContent: {
		content: ["list", "read", "create", "update", "delete", "publish"],
	},

	viewAnalytics: { analytics: ["view"] },
	exportAnalytics: { analytics: ["export"] },
	viewAudit: { audit: ["view"] },
} as const;
