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

		if (roles.includes("superadmin")) redirect("/superadmin");
		if (roles.includes("admin")) redirect("/admin");
		redirect("/dashboard");
	}

	// ✅ safe tab normalization
	const tab: Tab = isTab(rawTab) ? rawTab : "signin";

	return <AuthUI initialTab={tab} />;
}
