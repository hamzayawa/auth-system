import { redirect } from "next/navigation";

export function requireAuth(session: any) {
	if (!session?.user) redirect("/signin");
}

export function requireRole(session: any, role: string | string[]) {
	const roles = Array.isArray(role) ? role : [role];
	const userRoles = session?.user?.roles ?? [];

	const allowed = roles.some((r) => userRoles.includes(r));

	if (!allowed) redirect("/unauthorized");
}
