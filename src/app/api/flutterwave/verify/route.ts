import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { verifyTransaction } from "@/lib/flutterwave-server";

export async function GET(request: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const searchParams = request.nextUrl.searchParams;
		const transactionId = searchParams.get("transaction_id");

		if (!transactionId) {
			return NextResponse.json(
				{ error: "Transaction ID required" },
				{ status: 400 },
			);
		}

		const verification = await verifyTransaction(transactionId);

		return NextResponse.json({
			status: verification.status,
			data: verification.data,
		});
	} catch (error) {
		console.error("Verification error:", error);
		return NextResponse.json({ error: "Verification failed" }, { status: 500 });
	}
}
