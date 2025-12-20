import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { subscription } from "@/drizzle/schema";
import { auth } from "@/lib/auth/auth";
import { cancelSubscription } from "@/lib/flutterwave-server";

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { referenceId } = body as { referenceId: string };

		// Find the subscription
		const existingSubscription = await db.query.subscription.findFirst({
			where: eq(subscription.referenceId, referenceId),
		});

		if (!existingSubscription) {
			return NextResponse.json(
				{ error: "Subscription not found" },
				{ status: 404 },
			);
		}

		// If there's a Flutterwave subscription ID, cancel it
		if (existingSubscription.flutterwaveSubscriptionId) {
			await cancelSubscription(existingSubscription.flutterwaveSubscriptionId);
		}

		// Update subscription status in database
		await db
			.update(subscription)
			.set({
				status: "cancelled",
				cancelAtPeriodEnd: true,
				updatedAt: new Date(),
			})
			.where(eq(subscription.id, existingSubscription.id));

		return NextResponse.json({
			status: "success",
			message: "Subscription cancelled successfully",
		});
	} catch (error) {
		console.error("Cancel subscription error:", error);
		return NextResponse.json(
			{ error: "Failed to cancel subscription" },
			{ status: 500 },
		);
	}
}
