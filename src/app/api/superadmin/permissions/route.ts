import { type NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac/access-control";
import { getPermissions } from "@/lib/rbac/permission-builder";

export async function GET(request: NextRequest) {
	try {
		await requirePermission(request, {
			permission: ["read"],
		});

		const permissions = await getPermissions();
		return NextResponse.json(permissions);
	} catch (error: any) {
		if (error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		console.error("[API] Error fetching permissions:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
