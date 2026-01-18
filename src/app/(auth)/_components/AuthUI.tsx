"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SignInForm from "./sign-in-tab";
import SignUpForm from "./sign-up-tab";
import { EmailVerification } from "./email-verification";
import { ForgotPasswordForm } from "./forgot-password";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";

export default function AuthUI({ initialTab }: { initialTab: Tab }) {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [tab, setTab] = useState<Tab>(initialTab);

	function openEmailVerificationTab(email: string) {
		setEmail(email);
		setTab("email-verification");
		router.push("/email-verification");
	}

	return (
		<main className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md space-y-8">
				{tab === "signin" && (
					<SignInForm openEmailVerificationTab={openEmailVerificationTab} />
				)}

				{tab === "signup" && (
					<SignUpForm openEmailVerificationTab={openEmailVerificationTab} />
				)}

				{tab === "email-verification" && <EmailVerification email={email} />}

				{tab === "forgot-password" && (
					<ForgotPasswordForm openSignInTab={() => router.push("/signin")} />
				)}
			</div>
		</main>
	);
}
