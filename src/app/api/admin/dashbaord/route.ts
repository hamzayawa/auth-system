import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac/access-control";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schemas/auth-schema";

export async function GET(request: NextRequest) {
	try {
		await requireRole(request, ["admin", "superadmin"]);

		const [usersCount] = await db
			.select({ count: db.$count(user.id).as("count") })
			.from(user);

		return NextResponse.json({
			users: usersCount.count,
		});
	} catch (error: any) {
		if (error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		console.error("[ADMIN_DASHBOARD]", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
