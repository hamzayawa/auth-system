import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/rbac/access-control";
import { getUserPermissionsFromDB } from "@/lib/rbac/permission-builder";
import { getUserRoles } from "@/lib/rbac/roles";

export async function GET(request: NextRequest) {
	try {
		const session = await requireAuth(request);

		const roles = await getUserRoles(session.user.id);
		const permissions = await getUserPermissionsFromDB(session.user.id);

		return Response.json({
			roles: roles.map((r) => r.name),
			permissions,
			success: true,
		});
	} catch (error: any) {
		if (error.message === "Unauthorized") {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.error("Error fetching user roles:", error);
		return Response.json({ error: "Failed to fetch roles" }, { status: 500 });
	}
}
