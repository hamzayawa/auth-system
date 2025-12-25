import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BillingPage } from "@/components/billing/billing-page";
import { auth } from "@/lib/auth/auth";

export const metadata = {
	title: "Billing & Subscription",
	description: "Manage your subscription and billing",
};

export default async function BillingRoute() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth/sign-in");
	}

	// Use activeOrganizationId as referenceId if available, otherwise use userId
	const referenceId = session.session.activeOrganizationId || session.user.id;

	return <BillingPage userId={session.user.id} referenceId={referenceId} />;
}
