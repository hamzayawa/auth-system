import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionWithRoles } from "@/lib/auth/session.server";
import AuthUI from "../_components/AuthUI";

const TABS = [
	"signin",
	"signup",
	"email-verification",
	"forgot-password",
] as const;

type Tab = (typeof TABS)[number];

function isTab(value: string): value is Tab {
	return TABS.includes(value as Tab);
}

export default async function AuthPage({
	params,
}: {
	params: Promise<{ tab: string }>;
}) {
	// ✅ unwrap params (Next.js 15)
	const { tab: rawTab } = await params;

	// ✅ server session check
	const session = await getSessionWithRoles(await headers());

	if (session) {
		const roles = session.user.roles;
		const redirectRoutes = (session.user as any).redirectRoutes || {};

		console.log("🔍 Debug Auth Page:");
		console.log("Roles:", roles);
		console.log("Redirect Routes:", redirectRoutes);

		// 1. High-priority hardcoded roles
		if (roles.includes("superadmin")) {
			console.log("Redirecting to superadmin");
			redirect("/superadmin");
		}
		if (roles.includes("admin")) {
			console.log("Redirecting to admin");
			redirect("/admin");
		}

		// 2. Dynamic role redirects
		for (const role of roles) {
			const route = redirectRoutes[role];
			console.log(`Checking role: ${role}, route: ${route}`);

			// Ensure we don't redirect to dashboard if another role has a specific route
			// But since we loop, the first match wins.
			// Assumption: Order of `roles` array matters or is arbitrary.
			// If we want specific priority, we'd need to sort roles or have priority field.
			// For now, first found custom route wins.
			if (route && route !== "/dashboard/home") {
				console.log(`Redirecting to custom route: ${route}`);
				redirect(route);
			}
		}

		// 3. Default fallback
		console.log("Redirecting to default dashboard/home");
		redirect("/dashboard/home");
	}

	// ✅ safe tab normalization
	const tab: Tab = isTab(rawTab) ? rawTab : "signin";

	return <AuthUI initialTab={tab} />;
}
