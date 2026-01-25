import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSessionWithRoles } from "@/lib/auth/session.server";

export async function GET() {
    const session = await getSessionWithRoles(await headers());
    return NextResponse.json({
        message: "Debug Session",
        session,
    });
}
