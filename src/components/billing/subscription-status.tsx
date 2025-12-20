"use client";

import { format } from "date-fns";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { formatNaira, getPlanByName, PLAN_FEATURES } from "@/lib/flutterwave";
import { useCancelSubscription } from "@/lib/flutterwave-client";

type Subscription = {
	id: string;
	plan: string;
	status: string | null;
	paymentType: string | null;
	periodStart: Date | null;
	periodEnd: Date | null;
	cancelAtPeriodEnd: boolean | null;
	amount: number | null;
	referenceId: string;
};

type SubscriptionStatusProps = {
	subscription: Subscription;
	onCancelled?: () => void;
};

export function SubscriptionStatus({
	subscription,
	onCancelled,
}: SubscriptionStatusProps) {
	const { cancelSubscription, loading, error } = useCancelSubscription();
	const planDetails = getPlanByName(subscription.plan);
	const features = PLAN_FEATURES[subscription.plan] || [];

	const handleCancel = async () => {
		const success = await cancelSubscription(subscription.referenceId);
		if (success && onCancelled) {
			onCancelled();
		}
	};

	const getStatusBadge = () => {
		switch (subscription.status) {
			case "active":
				return (
					<Badge variant="default" className="gap-1">
						<CheckCircle className="h-3 w-3" />
						Active
					</Badge>
				);
			case "cancelled":
				return (
					<Badge variant="destructive" className="gap-1">
						<AlertCircle className="h-3 w-3" />
						Cancelled
					</Badge>
				);
			case "incomplete":
				return (
					<Badge variant="secondary" className="gap-1">
						<Clock className="h-3 w-3" />
						Pending
					</Badge>
				);
			default:
				return <Badge variant="outline">{subscription.status}</Badge>;
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="capitalize">{subscription.plan} Plan</CardTitle>
					{getStatusBadge()}
				</div>
				<CardDescription>
					{subscription.paymentType === "subscription"
						? "Monthly subscription"
						: "One-time payment"}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="flex items-baseline gap-1">
					<span className="text-2xl font-bold">
						{formatNaira(subscription.amount || planDetails?.amount || 0)}
					</span>
					{subscription.paymentType === "subscription" && (
						<span className="text-muted-foreground">/month</span>
					)}
				</div>

				{subscription.periodEnd && (
					<div className="text-sm text-muted-foreground">
						{subscription.cancelAtPeriodEnd ? (
							<span>
								Access until{" "}
								{format(new Date(subscription.periodEnd), "MMMM d, yyyy")}
							</span>
						) : (
							<span>
								Renews on{" "}
								{format(new Date(subscription.periodEnd), "MMMM d, yyyy")}
							</span>
						)}
					</div>
				)}

				<div className="space-y-2">
					<p className="text-sm font-medium">Included features:</p>
					<ul className="space-y-1">
						{features.map((feature, index) => (
							<li
								key={index}
								className="flex items-center gap-2 text-sm text-muted-foreground"
							>
								<CheckCircle className="h-3 w-3 text-primary" />
								{feature}
							</li>
						))}
					</ul>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}
			</CardContent>

			<CardFooter>
				{subscription.status === "active" &&
					subscription.paymentType === "subscription" &&
					!subscription.cancelAtPeriodEnd && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" disabled={loading}>
									{loading ? "Cancelling..." : "Cancel Subscription"}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to cancel your subscription? You will
										continue to have access until the end of your current
										billing period.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Keep Subscription</AlertDialogCancel>
									<AlertDialogAction onClick={handleCancel}>
										Yes, Cancel
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
			</CardFooter>
		</Card>
	);
}
