import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionWithRoles } from "@/lib/auth/session.server";

export default async function DashboardRouter() {
	const session = await getSessionWithRoles(await headers());

	if (!session) {
		redirect("/signin");
	}

	const roles = session.user.roles ?? [];

	// 1. Check for dynamic redirects
	const redirectRoutes = (session.user as any).redirectRoutes || {};
	for (const role of roles) {
		const route = redirectRoutes[role];
		if (route && route !== "/dashboard/home") {
			redirect(route);
		}
	}

	// 2. Hardcoded fallbacks (keep superadmin/admin if not overridden by dynamic, or put before dynamic if priority dictates)
	// User requirement was: "redirect the user to user dashboard instead of hr dashboard"
	// Current implementation has hardcoded checks first.
	// If the user wants to prioritize superadmin/admin strict routes, keep this.
	// But if a superadmin wants a custom dashboard, we should check dynamic first?
	// Let's mirror the AuthPage logic I established earlier:
	// Hardcoded Admin/Superadmin first, then Custom.
	// WAIT: the user wants to assign a role 'hr' and go to 'hr dashboard'.
	// So let's insert the dynamic check AFTER hardcoded admins (unless he assigns HR to an admin?).
	// Let's assume standard priority: Superadmin > Admin > Dynamic > Default.

	if (roles.includes("superadmin")) {
		redirect("/superadmin");
	}

	if (roles.includes("admin")) {
		redirect("/admin");
	}

	// Double check dynamic again if not caught above (redundant if strict order matches)
	// Actually, let's just place dynamic check here.

	// normal users
	redirect("/dashboard/home");
}
