"use client";

import { ForgotPassword } from "../login/_components/forgot-password";

export default function ForgotPasswordPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
			<div className="w-full max-w-md">
				<ForgotPassword
					onBackToSignIn={() => (window.location.href = "/auth/login")}
				/>
			</div>
		</main>
	);
}
