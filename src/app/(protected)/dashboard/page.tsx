import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionWithRoles } from "@/lib/auth/session.server";

export default async function DashboardRouter() {
	const session = await getSessionWithRoles(await headers());

	if (!session) {
		redirect("/signin");
	}

	const roles = session.user.roles ?? [];

	if (roles.includes("superadmin")) {
		redirect("/superadmin");
	}

	if (roles.includes("admin")) {
		redirect("/admin");
	}

	// normal users
	redirect("/dashboard/home");
}
