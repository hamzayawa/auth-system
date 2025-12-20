import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getPlanByName } from "@/lib/flutterwave";
import { generateTxRef, initializePayment } from "@/lib/flutterwave-server";

export async function POST(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			plan,
			referenceId,
			paymentType = "subscription",
		} = body as {
			plan: string;
			referenceId: string;
			paymentType?: "one_time" | "subscription";
		};

		const planDetails = getPlanByName(plan);
		if (!planDetails) {
			return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
		}

		const txRef = generateTxRef(`${plan}_${paymentType}`);
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		const payload = {
			tx_ref: txRef,
			amount: planDetails.amount,
			currency: "NGN",
			redirect_url: `${appUrl}/api/flutterwave/callback?ref=${txRef}`,
			customer: {
				email: session.user.email,
				name: session.user.name,
			},
			customizations: {
				title: "Subscription Payment",
				description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - ${paymentType === "subscription" ? "Monthly" : "One-time"}`,
			},
			meta: {
				userId: session.user.id,
				plan,
				referenceId,
				paymentType,
			},
		};

		const response = await initializePayment(payload);

		if (response.status === "success" && response.data?.link) {
			return NextResponse.json({
				status: "success",
				paymentLink: response.data.link,
				txRef,
			});
		}

		return NextResponse.json(
			{ error: response.message || "Failed to initialize payment" },
			{ status: 400 },
		);
	} catch (error) {
		console.error("Payment initialization error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
