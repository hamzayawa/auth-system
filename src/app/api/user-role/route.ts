import { NextRequest, NextResponse } from "next/server";
import { getSessionWithRoles } from "@/lib/auth/session.server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import * as rbacSchema from "@/drizzle/schemas/rbac-schema";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionWithRoles(request.headers);
    if (!session || !session.user.roles?.includes("superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ db.query.users works automatically with relations
    const usersWithRoles = await db.query.user.findMany({
      columns: { id: true, email: true },
      with: {
        userRoles: {
          with: {
            role: {
              columns: { name: true },
            },
          },
        },
      },
    });

    const users = usersWithRoles.map((user) => ({
      id: user.id,
      email: user.email,
      roles: user.userRoles.map((ur) => ur.role.name),
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[API/USER-ROLE] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionWithRoles(request.headers);
    if (!session || !session.user.roles?.includes("superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, roles } = await request.json();

    // ✅ Direct table references
    await db
      .delete(rbacSchema.userRole)
      .where(eq(rbacSchema.userRole.userId, userId));

    if (roles?.length > 0) {
      // ✅ Direct table query
      const roleRecords = await db.query.role.findMany({
        where: (role, { inArray }) => inArray(role.name, roles),
        columns: { id: true },
      });

      await db.insert(rbacSchema.userRole).values(
        roleRecords.map((r: any) => ({
          userId,
          roleId: r.id,
        })),
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API/USER-ROLE] POST Error:", error);
    return NextResponse.json(
      { error: "Failed to update roles" },
      { status: 500 },
    );
  }
}
