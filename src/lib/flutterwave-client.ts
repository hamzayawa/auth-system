"use client";

// Client-side Flutterwave utilities and hooks
import { useState } from "react";
import useSWR from "swr";

type InitializePaymentParams = {
	plan: string;
	referenceId: string;
	paymentType?: "one_time" | "subscription";
};

type PaymentResponse = {
	status: string;
	paymentLink?: string;
	txRef?: string;
	error?: string;
};

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Hook to initialize payment
export function useInitializePayment() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const initializePayment = async (
		params: InitializePaymentParams,
	): Promise<PaymentResponse | null> => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/flutterwave/initialize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params),
			});

			const data = await response.json();

			if (data.status === "success" && data.paymentLink) {
				// Redirect to Flutterwave payment page
				window.location.href = data.paymentLink;
				return data;
			}

			setError(data.error || "Failed to initialize payment");
			return null;
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Payment initialization failed";
			setError(message);
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { initializePayment, loading, error };
}

// Hook to cancel subscription
export function useCancelSubscription() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const cancelSubscription = async (referenceId: string): Promise<boolean> => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/flutterwave/cancel", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ referenceId }),
			});

			const data = await response.json();

			if (data.status === "success") {
				return true;
			}

			setError(data.error || "Failed to cancel subscription");
			return false;
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Cancellation failed";
			setError(message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { cancelSubscription, loading, error };
}

// Hook to get subscription status (can be used with referenceId)
export function useSubscription(referenceId: string | null) {
	const { data, error, isLoading, mutate } = useSWR(
		referenceId ? `/api/subscription?referenceId=${referenceId}` : null,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		},
	);

	return {
		subscription: data?.subscription,
		isLoading,
		error: error?.message,
		refresh: mutate,
	};
}
