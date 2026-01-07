"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSubscription } from "@/lib/flutterwave-client";
import { PricingSection } from "./pricing-section";
import { SubscriptionStatus } from "./subscription-status";

type BillingPageProps = {
	userId: string;
	referenceId: string; // Usually organization ID or user ID
};

export function BillingPage({ referenceId }: BillingPageProps) {
	const searchParams = useSearchParams();
	const { subscription, isLoading, refresh } = useSubscription(referenceId);
	const [showAlert, setShowAlert] = useState<"success" | "error" | null>(null);

	useEffect(() => {
		const success = searchParams.get("success");
		const error = searchParams.get("error");

		if (success === "true") {
			setShowAlert("success");
			refresh();
			// Clear after 5 seconds
			setTimeout(() => setShowAlert(null), 5000);
		} else if (error) {
			setShowAlert("error");
			setTimeout(() => setShowAlert(null), 5000);
		}
	}, [searchParams, refresh]);

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			{showAlert === "success" && (
				<Alert className="mb-6 border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
					<CheckCircle className="h-4 w-4" />
					<AlertTitle>Payment Successful</AlertTitle>
					<AlertDescription>
						Your subscription has been activated. Thank you for your purchase!
					</AlertDescription>
				</Alert>
			)}

			{showAlert === "error" && (
				<Alert variant="destructive" className="mb-6">
					<XCircle className="h-4 w-4" />
					<AlertTitle>Payment Failed</AlertTitle>
					<AlertDescription>
						There was an issue processing your payment. Please try again or
						contact support.
					</AlertDescription>
				</Alert>
			)}

			<h1 className="mb-8 text-3xl font-bold">Billing & Subscription</h1>

			{subscription && subscription.status === "active" ? (
				<div className="space-y-8">
					<section>
						<h2 className="mb-4 text-xl font-semibold">Current Subscription</h2>
						<div className="max-w-md">
							<SubscriptionStatus
								subscription={subscription}
								onCancelled={refresh}
							/>
						</div>
					</section>

					<section>
						<h2 className="mb-4 text-xl font-semibold">Upgrade Your Plan</h2>
						<PricingSection
							referenceId={referenceId}
							currentPlan={subscription.plan}
						/>
					</section>
				</div>
			) : (
				<PricingSection referenceId={referenceId} />
			)}
		</div>
	);
}
