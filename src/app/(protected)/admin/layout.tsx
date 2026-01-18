import { headers } from "next/headers";
import { getSessionWithRoles } from "@/lib/auth/session.server";
import { requireRole } from "@/lib/auth/guards.server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSessionWithRoles(await headers());

	requireRole(session, "admin");

	return <>{children}</>;
}
