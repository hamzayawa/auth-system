"use client";

import { FLUTTERWAVE_PLANS } from "@/lib/flutterwave";
import { PricingCard } from "./pricing-card";

type PricingSectionProps = {
	referenceId: string;
	currentPlan?: string;
};

export function PricingSection({
	referenceId,
	currentPlan,
}: PricingSectionProps) {
	return (
		<div className="py-12">
			<div className="mb-10 text-center">
				<h2 className="text-3xl font-bold tracking-tight">Choose Your Plan</h2>
				<p className="mt-2 text-muted-foreground">
					Select the plan that works best for you
				</p>
			</div>

			<div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
				{FLUTTERWAVE_PLANS.map((plan) => (
					<PricingCard
						key={plan.name}
						plan={plan}
						referenceId={referenceId}
						currentPlan={currentPlan}
						isPopular={plan.name === "pro"}
					/>
				))}
			</div>
		</div>
	);
}
