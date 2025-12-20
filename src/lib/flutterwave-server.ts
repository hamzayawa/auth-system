import { eq } from "drizzle-orm";
import Flutterwave from "flutterwave-node-v3";
import { nanoid } from "nanoid";
import { db } from "@/drizzle/db";
import { subscription, user } from "@/drizzle/schema";
import { getPlanByName } from "./flutterwave";

const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY!;
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY!;

// Initialize Flutterwave SDK
const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);

export type FlutterwavePaymentPayload = {
	tx_ref: string;
	amount: number;
	currency: string;
	redirect_url: string;
	customer: {
		email: string;
		name: string;
	};
	customizations: {
		title: string;
		description: string;
		logo?: string;
	};
	payment_plan?: string;
	meta?: Record<string, unknown>;
};

export type FlutterwaveResponse = {
	status: string;
	message: string;
	data?: {
		link?: string;
		id?: number;
		tx_ref?: string;
		flw_ref?: string;
		status?: string;
		amount?: number;
		currency?: string;
		customer?: {
			id: number;
			email: string;
			name: string;
		};
	};
};

export type FlutterwaveWebhookPayload = {
	event: string;
	data: {
		id: number;
		tx_ref: string;
		flw_ref: string;
		status: string;
		amount: number;
		currency: string;
		customer: {
			id: number;
			email: string;
			name: string;
		};
		payment_type?: string;
	};
};

export async function initializePayment(
	payload: FlutterwavePaymentPayload,
): Promise<FlutterwaveResponse> {
	const response = await flw.Charge.card({
		...payload,
		enckey: process.env.FLW_ENCRYPTION_KEY,
	});
	return response;
}

export async function initializeHostedPayment(
	payload: FlutterwavePaymentPayload,
): Promise<FlutterwaveResponse> {
	// For hosted payment page, we still use the payments endpoint
	const response = await fetch("https://api.flutterwave.com/v3/payments", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${FLW_SECRET_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	return response.json();
}

export async function verifyTransaction(
	transactionId: string | number,
): Promise<FlutterwaveResponse> {
	const response = await flw.Transaction.verify({ id: transactionId });
	return response;
}

export async function createPaymentPlan(plan: {
	name: string;
	amount: number;
	interval: "monthly" | "yearly" | "weekly" | "daily";
}): Promise<FlutterwaveResponse> {
	const response = await flw.PaymentPlan.create({
		name: plan.name,
		amount: plan.amount,
		interval: plan.interval,
		currency: "NGN",
	});
	return response;
}

export async function cancelSubscription(
	subscriptionId: string,
): Promise<FlutterwaveResponse> {
	const response = await flw.Subscription.cancel({ id: subscriptionId });
	return response;
}

export async function getSubscriptions(): Promise<FlutterwaveResponse> {
	const response = await flw.Subscription.fetch_all();
	return response;
}

export async function getSubscription(
	subscriptionId: string,
): Promise<FlutterwaveResponse> {
	const response = await flw.Subscription.get({ id: subscriptionId });
	return response;
}

// Generate a unique transaction reference
export function generateTxRef(prefix = "txn"): string {
	return `${prefix}_${nanoid(16)}`;
}

// Process successful payment and update database
export async function processSuccessfulPayment(data: {
	userId: string;
	referenceId: string;
	plan: string;
	transactionId: string;
	customerId: string;
	paymentType: "one_time" | "subscription";
	subscriptionId?: string;
}) {
	const planDetails = getPlanByName(data.plan);
	if (!planDetails) {
		throw new Error(`Invalid plan: ${data.plan}`);
	}

	const now = new Date();
	const periodEnd = new Date(now);
	periodEnd.setMonth(periodEnd.getMonth() + 1);

	// Update or create subscription
	const existingSubscription = await db.query.subscription.findFirst({
		where: eq(subscription.referenceId, data.referenceId),
	});

	if (existingSubscription) {
		await db
			.update(subscription)
			.set({
				plan: data.plan,
				flutterwaveTransactionId: data.transactionId,
				flutterwaveCustomerId: data.customerId,
				flutterwaveSubscriptionId: data.subscriptionId,
				paymentType: data.paymentType,
				status: "active",
				periodStart: now,
				periodEnd: periodEnd,
				amount: planDetails.amount,
				currency: "NGN",
				updatedAt: now,
			})
			.where(eq(subscription.id, existingSubscription.id));
	} else {
		await db.insert(subscription).values({
			id: nanoid(),
			plan: data.plan,
			referenceId: data.referenceId,
			flutterwaveTransactionId: data.transactionId,
			flutterwaveCustomerId: data.customerId,
			flutterwaveSubscriptionId: data.subscriptionId,
			paymentType: data.paymentType,
			status: "active",
			periodStart: now,
			periodEnd: periodEnd,
			amount: planDetails.amount,
			currency: "NGN",
			createdAt: now,
			updatedAt: now,
		});
	}

	// Update user's flutterwave customer ID
	await db
		.update(user)
		.set({ flutterwaveCustomerId: data.customerId })
		.where(eq(user.id, data.userId));
}

// Verify webhook signature
export function verifyWebhookSignature(
	signature: string | null,
	secretHash: string,
): boolean {
	return signature === secretHash;
}
