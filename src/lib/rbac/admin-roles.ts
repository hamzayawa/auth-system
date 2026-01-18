// lib/admin-roles.ts - ONLY for server-side admin plugin (NOT client-safe)
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

// Same statements as permissions.ts
const ac = createAccessControl({
	...defaultStatements,
	user: ["list", "read", "create", "update", "delete", "set-password"],
	role: ["list", "read", "create", "update", "delete", "assign"],
	permission: ["list", "read", "assign", "revoke"],
	content: ["list", "read", "create", "update", "delete", "publish"],
	analytics: ["view", "export"],
	audit: ["view"],
} as const);

// REQUIRED by admin plugin - minimal bootstrap roles
export const adminRole = ac.newRole({
	user: ["list", "read", "create", "update", "delete"],
	role: ["list", "read", "assign"],
	permission: ["list", "read"],
	content: ["list", "read", "create", "update"],
});

export const superadminRole = ac.newRole({
	// Full access matching your statements
	user: ["list", "read", "create", "update", "delete", "set-password"],
	role: ["list", "read", "create", "update", "delete", "assign"],
	permission: ["list", "read", "assign", "revoke"],
	content: ["list", "read", "create", "update", "delete", "publish"],
	analytics: ["view", "export"],
	audit: ["view"],
});

export const roles = {
	admin: adminRole,
	superadmin: superadminRole,
} as const;

export { ac }; // Export for consistency
