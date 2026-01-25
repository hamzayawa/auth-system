import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { role } from "@/drizzle/schemas/rbac-schema";
import { requirePermission } from "@/lib/rbac/access-control";
import {
  assignPermissionsToRole,
  createRole,
  deleteRole,
  updateRole,
} from "@/lib/rbac/roles";

// GET /api/superadmin/roles - Fetch all roles with their permissions
export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, { role: ["read"] });

    const roles = await db.query.role.findMany({
      with: {
        permissions: {
          with: {
            permission: true,
          },
        },
      },
    });

    return NextResponse.json(roles);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("[API] Error fetching roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/superadmin/roles - Create new role
export async function POST(request: NextRequest) {
  try {
    await requirePermission(request, { role: ["create"] });

    const { name, description, redirectRoute, permissionIds } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Role name is required" },
        { status: 400 },
      );
    }

    const newRole = await createRole(
      name,
      description,
      redirectRoute,
      permissionIds || [],
    );
    return NextResponse.json(newRole, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("[API] Error creating role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
// PATCH /api/superadmin/roles/:id - Update role
export async function PATCH(request: NextRequest) {
  try {
    // ✅ Use "edit" (matches your DB permissions)
    await requirePermission(request, { role: ["update"] });

    const body = await request.json();
    console.log("🔧 PATCH body:", body);

    const { roleId, name, description, redirectRoute, permissionIds = [] } =
      body;

    const updatedRole = await updateRole(
      roleId,
      name,
      description,
      redirectRoute,
    );
    await assignPermissionsToRole(roleId, permissionIds);

    return NextResponse.json(updatedRole);
  } catch (error: any) {
    console.error("[API] Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 403 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requirePermission(request, { role: ["delete"] });

    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 },
      );
    }

    const roleData = await db.query.role.findFirst({
      where: eq(role.id, roleId),
    });

    if (!roleData) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    await deleteRole(roleId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.error("[API] Error deleting role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
