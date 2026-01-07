"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type FlutterwavePlan,
	formatNaira,
	PLAN_FEATURES,
} from "@/lib/flutterwave";
import { useInitializePayment } from "@/lib/flutterwave-client";
import { cn } from "@/lib/utils";

type PricingCardProps = {
	plan: FlutterwavePlan;
	referenceId: string;
	currentPlan?: string;
	isPopular?: boolean;
};

export function PricingCard({
	plan,
	referenceId,
	currentPlan,
	isPopular = false,
}: PricingCardProps) {
	const { initializePayment, loading, error } = useInitializePayment();
	const isCurrentPlan = currentPlan === plan.name;
	const features = PLAN_FEATURES[plan.name] || [];

	const handleSubscribe = async (paymentType: "one_time" | "subscription") => {
		await initializePayment({
			plan: plan.name,
			referenceId,
			paymentType,
		});
	};

	return (
		<Card
			className={cn(
				"relative flex flex-col",
				isPopular && "border-primary shadow-lg",
			)}
		>
			{isPopular && (
				<Badge
					className="absolute -top-3 left-1/2 -translate-x-1/2"
					variant="default"
				>
					Most Popular
				</Badge>
			)}

			<CardHeader className="text-center">
				<CardTitle className="text-xl capitalize">{plan.name}</CardTitle>
				<CardDescription>
					<span className="text-3xl font-bold text-foreground">
						{formatNaira(plan.amount)}
					</span>
					<span className="text-muted-foreground">/month</span>
				</CardDescription>
			</CardHeader>

			<CardContent className="flex-1">
				<ul className="space-y-3">
					{features.map((feature) => (
						<li key={feature} className="flex items-center gap-2">
							<Check className="h-4 w-4 text-primary" />
							<span className="text-sm">{feature}</span>
						</li>
					))}
				</ul>

				{error && <p className="mt-4 text-sm text-destructive">{error}</p>}
			</CardContent>

			<CardFooter className="flex flex-col gap-2">
				{isCurrentPlan ? (
					<Button disabled className="w-full bg-transparent" variant="outline">
						Current Plan
					</Button>
				) : (
					<>
						<Button
							className="w-full"
							onClick={() => handleSubscribe("subscription")}
							disabled={loading}
						>
							{loading ? "Processing..." : "Subscribe Monthly"}
						</Button>
						<Button
							className="w-full bg-transparent"
							variant="outline"
							onClick={() => handleSubscribe("one_time")}
							disabled={loading}
						>
							{loading ? "Processing..." : "Pay Once"}
						</Button>
					</>
				)}
			</CardFooter>
		</Card>
	);
}
