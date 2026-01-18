import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { role } from "@/drizzle/schemas/rbac-schema";
import { requireRole } from "@/lib/auth/guards.server";
import { getSessionWithRoles } from "@/lib/auth/session.server";
import { eq } from "drizzle-orm";
import {
	createRole,
	assignPermissionsToRole,
	updateRole,
} from "@/lib/rbac/roles";
import { deleteRole } from "@/lib/rbac/roles";

export async function GET(request: Request) {
	try {
		const headers = new Headers(request.headers);
		const session = await getSessionWithRoles(headers);

		requireRole(session, "admin");

		const rolesList = await db.query.role.findMany({
			with: { permissions: { with: { permission: true } } },
		});

		return NextResponse.json({ success: true, roles: rolesList });
	} catch (error: any) {
		if (error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("[Admin API] GET /roles error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const headers = new Headers(request.headers);
		const session = await getSessionWithRoles(headers);

		requireRole(session, "admin");

		const { name, description, permissionIds } = await request.json();

		if (!name?.trim()) {
			return NextResponse.json(
				{ error: "Role name is required" },
				{ status: 400 },
			);
		}

		const newRole = await createRole(name, description, permissionIds || []);
		return NextResponse.json(newRole, { status: 201 });
	} catch (error: any) {
		if (error.message === "Unauthorized") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (error.message === "Forbidden") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		console.error("[Admin API] POST /roles error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: Request) {
	try {
		const headers = new Headers(request.headers);
		const session = await getSessionWithRoles(headers);

		requireRole(session, "admin");

		const { roleId, name, description, permissionIds } = await request.json();
		if (!roleId)
			return NextResponse.json({ error: "Role ID required" }, { status: 400 });

		const roleData = await db.query.role.findFirst({
			where: eq(role.id, roleId),
		});
		if (!roleData)
			return NextResponse.json({ error: "Role not found" }, { status: 404 });

		const updated = await updateRole(roleId, name, description);

		if (permissionIds) {
			await assignPermissionsToRole(roleId, permissionIds);
		}

		return NextResponse.json(updated);
	} catch (error: any) {
		if (error.message === "Unauthorized")
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		if (error.message === "Forbidden")
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		console.error("[Admin API] PATCH /roles error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const headers = new Headers(request.headers);
		const session = await getSessionWithRoles(headers);

		requireRole(session, "admin");

		const { roleId } = await request.json();
		if (!roleId)
			return NextResponse.json({ error: "Role ID required" }, { status: 400 });

		const roleData = await db.query.role.findFirst({
			where: eq(role.id, roleId),
		});
		if (!roleData)
			return NextResponse.json({ error: "Role not found" }, { status: 404 });

		await deleteRole(roleId);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		if (error.message === "Unauthorized")
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		if (error.message === "Forbidden")
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		console.error("[Admin API] DELETE /roles error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
