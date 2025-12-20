import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { subscription } from "@/drizzle/schema";
import { auth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const searchParams = request.nextUrl.searchParams;
		const referenceId = searchParams.get("referenceId");

		if (!referenceId) {
			return NextResponse.json(
				{ error: "Reference ID required" },
				{ status: 400 },
			);
		}

		const existingSubscription = await db.query.subscription.findFirst({
			where: eq(subscription.referenceId, referenceId),
		});

		if (!existingSubscription) {
			return NextResponse.json({ subscription: null });
		}

		return NextResponse.json({ subscription: existingSubscription });
	} catch (error) {
		console.error("Get subscription error:", error);
		return NextResponse.json(
			{ error: "Failed to get subscription" },
			{ status: 500 },
		);
	}
}
