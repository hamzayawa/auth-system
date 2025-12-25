"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import SignInForm from "./_components/sign-in-tab";

export default function LoginPage() {
	const router = useRouter();

	const handleForgotPassword = () => {
		router.push("/forgot-password");
	};

	const handleToggle = () => {
		router.push("/register");
	};

	const handleEmailVerification = (email: string) => {
		router.push(`/verify-email?email=${encodeURIComponent(email)}`);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md border-none shadow-lg">
				<CardContent className="pt-8">
					<SignInForm
						onToggle={handleToggle}
						onForgotPassword={handleForgotPassword}
						onEmailVerification={handleEmailVerification}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

