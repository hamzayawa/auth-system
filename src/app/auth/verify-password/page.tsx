"use client";

import { useSearchParams } from "next/navigation";
import { EmailVerification } from "../login/_components/email-verification";

export default function VerifyEmailPage() {
	const params = useSearchParams();
	const email = params.get("email") ?? "";

	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
			<div className="w-full max-w-md">
				<EmailVerification
					email={email}
					onBackToSignIn={() => (window.location.href = "/auth/login")}
				/>
			</div>
		</main>
	);
}
