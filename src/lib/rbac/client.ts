"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/auth-provider";

export function usePermissions() {
	const { session } = useAuth();

	return useMemo(() => {
		const permissionObject = session?.user?.permissionObject || {};

		return {
			// Check if user has specific resource:action permission
			has: (resource: string, action: string | string[]) => {
				const actions = Array.isArray(action) ? action : [action];
				return (
					permissionObject[resource] &&
					actions.every((a) => permissionObject[resource].includes(a))
				);
			},
			// Check if user has any of the specified actions for a resource
			hasAny: (resource: string, actions: string[]) => {
				return (
					permissionObject[resource] &&
					actions.some((a) => permissionObject[resource].includes(a))
				);
			},
			// Get all permissions for a resource
			forResource: (resource: string) => permissionObject[resource] || [],
			// Get entire permission object
			all: permissionObject,
		};
	}, [session?.user?.permissionObject]);
}

export function useRoles() {
	const { session } = useAuth();

	return useMemo(() => {
		const roles = session?.user?.roles || [];

		return {
			has: (role: string | string[]) => {
				const r = Array.isArray(role) ? role : [role];
				return r.some((role) => roles.includes(role));
			},
			isSuperadmin: () => roles.includes("superadmin"),
			isAdmin: () => roles.includes("admin") || roles.includes("superadmin"),
			isUser: () => roles.length > 0,
			all: roles,
		};
	}, [session?.user?.roles]);
}

export function useUserRole() {
	const roles = useRoles();

	return useMemo(() => {
		if (roles.isSuperadmin()) return "superadmin";
		if (roles.isAdmin()) return "admin";
		return "user";
	}, [roles]);
}
