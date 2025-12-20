// Flutterwave Plans Configuration for NGN (Nigerian Naira)

export type FlutterwavePlan = {
	name: string;
	planId?: string; // Optional: Flutterwave payment plan ID for recurring
	amount: number; // Amount in NGN
	interval?: "monthly" | "yearly" | "weekly" | "daily";
	limits: {
		projects: number;
	};
};

export const FLUTTERWAVE_PLANS: FlutterwavePlan[] = [
	{
		name: "basic",
		amount: 2500, // 2,500 NGN/month
		interval: "monthly",
		limits: {
			projects: 10,
		},
	},
	{
		name: "pro",
		amount: 7500, // 7,500 NGN/month
		interval: "monthly",
		limits: {
			projects: 50,
		},
	},
];

export const PLAN_TO_PRICE: Record<string, number> = {
	basic: 2500,
	pro: 7500,
};

export const PLAN_FEATURES: Record<string, string[]> = {
	basic: ["Up to 10 projects", "Basic support", "Email notifications"],
	pro: [
		"Up to 50 projects",
		"Priority support",
		"Advanced analytics",
		"API access",
	],
};

export function getPlanByName(name: string): FlutterwavePlan | undefined {
	return FLUTTERWAVE_PLANS.find((plan) => plan.name === name);
}

export function formatNaira(amount: number): string {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	}).format(amount);
}
