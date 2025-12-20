import { type NextRequest, NextResponse } from "next/server";
import {
	processSuccessfulPayment,
	verifyTransaction,
} from "@/lib/flutterwave-server";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const status = searchParams.get("status");
		const txRef = searchParams.get("tx_ref");
		const transactionId = searchParams.get("transaction_id");

		const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

		if (status !== "successful" || !transactionId) {
			return NextResponse.redirect(
				`${appUrl}/billing?error=payment_failed&ref=${txRef}`,
			);
		}

		// Verify the transaction
		const verification = await verifyTransaction(transactionId);

		if (
			verification.status === "success" &&
			verification.data?.status === "successful"
		) {
			// Extract metadata from tx_ref
			const [plan, paymentType] = txRef?.split("_") || [];

			// Get metadata from the transaction
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
					transactionId: String(verification.data?.id),
					customerId: String(verification.data?.customer?.id),
					paymentType: meta.meta.paymentType,
				});
			}

			return NextResponse.redirect(
				`${appUrl}/billing?success=true&plan=${plan}`,
			);
		}

		return NextResponse.redirect(
			`${appUrl}/billing?error=verification_failed&ref=${txRef}`,
		);
	} catch (error) {
		console.error("Payment callback error:", error);
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
		return NextResponse.redirect(`${appUrl}/billing?error=callback_error`);
	}
}
