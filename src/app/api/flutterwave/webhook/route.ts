import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { subscription } from "@/drizzle/schema";
import { env } from "@/lib/env";
import {
	type FlutterwaveWebhookPayload,
	processSuccessfulPayment,
	verifyTransaction,
	verifyWebhookSignature,
} from "@/lib/flutterwave-server";

const FLW_WEBHOOK_HASH = env.FLW_WEBHOOK_HASH;
if (!FLW_WEBHOOK_HASH) {
	throw new Error("FLW_WEBHOOK_HASH environment variable is required");
}

export async function POST(request: NextRequest) {
	try {
		const signature = request.headers.get("verif-hash");

		// Verify webhook signature
		if (!verifyWebhookSignature(signature, FLW_WEBHOOK_HASH)) {
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const payload = (await request.json()) as FlutterwaveWebhookPayload;

		// Handle different webhook events
		switch (payload.event) {
			case "charge.completed":
				await handleChargeCompleted(payload);
				break;

			case "subscription.cancelled":
				await handleSubscriptionCancelled(payload);
				break;

			case "transfer.completed":
				// Handle transfer if needed
				break;

			default:
				console.log(`Unhandled webhook event: ${payload.event}`);
		}

		return NextResponse.json({ status: "success" });
	} catch (error) {
		console.error("Webhook processing error:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 },
		);
	}
}

async function handleChargeCompleted(payload: FlutterwaveWebhookPayload) {
	const { data } = payload;

	if (data.status !== "successful") {
		return;
	}

	// Verify the transaction
	const verification = await verifyTransaction(data.id);

	if (
		verification.status !== "success" ||
		verification.data?.status !== "successful"
	) {
		console.error("Transaction verification failed for webhook:", data.tx_ref);
		return;
	}

	// Parse tx_ref to get payment details
	// Format: plan_paymentType_uniqueId (e.g., basic_subscription_abc123)
	const txRefParts = data.tx_ref.split("_");
	if (txRefParts.length < 2) {
		console.error("Invalid tx_ref format:", data.tx_ref);
		return;
	}

	// The meta should be included in the verification response
	const meta = verification.data as unknown as {
		meta?: {
			userId: string;
			plan: string;
			referenceId: string;
			paymentType: "one_time" | "subscription";
		};
	};

	if (meta.meta) {
		await processSuccessfulPayment({
			userId: meta.meta.userId,
			referenceId: meta.meta.referenceId,
			plan: meta.meta.plan,
			transactionId: String(data.id),
			customerId: String(data.customer.id),
			paymentType: meta.meta.paymentType,
		});
	}
}

async function handleSubscriptionCancelled(payload: FlutterwaveWebhookPayload) {
	const { data } = payload;

	// Find subscription by flutterwave transaction ID or customer ID
	const existingSubscription = await db.query.subscription.findFirst({
		where: eq(subscription.flutterwaveCustomerId, String(data.customer.id)),
	});

	if (existingSubscription) {
		await db
			.update(subscription)
			.set({
				status: "cancelled",
				cancelAtPeriodEnd: true,
				updatedAt: new Date(),
			})
			.where(eq(subscription.id, existingSubscription.id));
	}
}
