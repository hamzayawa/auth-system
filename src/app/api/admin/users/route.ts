import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schemas/auth-schema";
import { requireRole } from "@/lib/auth/guards.server";
import { getSessionWithRoles } from "@/lib/auth/session.server";

export async function GET(request: Request) {
	try {
		// get session with roles
		const headers = new Headers(request.headers);
		const session = await getSessionWithRoles(headers);

		// require admin
		requireRole(session, "admin");

		// fetch users + count
		const usersList = await db.select().from(user);
		const [usersCount] = await db
			.select({ count: db.$count(user.id).as("count") })
			.from(user);

		return NextResponse.json({
			success: true,
			users: usersList,
			total: usersCount.count,
		});
	} catch (error: any) {
		if (error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("[Admin API] GET /users error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
