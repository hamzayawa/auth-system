"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { validateEmail, validatePassword } from "@/lib/validation";
import AnimatedInput from "@/components/auth/animated-input";
import { SocialAuthButtons } from "../../_components/social-auth-buttons";
import ValidationFeedback from "../../_components/validation-feedback";
import { SpinnerCustom } from "@/components/ui/spinner";
// import { PasskeyButton } from "./passkey-button"

interface SignInFormProps {
	onToggle: () => void;
	onForgotPassword: () => void;
	onEmailVerification: (email: string) => void;
}

interface FormData {
	email: string;
	password: string;
}

interface ValidationErrors {
	[key: string]: string | null;
}

export default function SignInForm({
	// onToggle,
	// onForgotPassword,
	onEmailVerification,
}: SignInFormProps) {
	const router = useRouter();
	const [formData, setFormData] = useState<FormData>({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const isFormValid =
		formData.email && formData.password && !errors.email && !errors.password;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let error: string | null = null;

		switch (name) {
			case "email":
				error = validateEmail(value);
				break;
			case "password":
				error = validatePassword(value);
				break;
		}

		setErrors((prev) => ({ ...prev, [name]: error }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) return;

		setIsLoading(true);

		await authClient.signIn.email(
			{ email: formData.email, password: formData.password, callbackURL: "/" },
			{
				onError: (error) => {
					if (error.error.code === "EMAIL_NOT_VERIFIED") {
						const token = error.error.verificationToken;
						if (token) onEmailVerification(token);
					}
					toast.error(error.error.message || "Failed to sign in");
				},

				onSuccess: () => {
					router.push("/");
				},
			},
		);

		setIsLoading(false);
	};

	return (
		<div className="animate-fade-in">
			<div className="mb-8 text-center">
				<h1 className="text-balance text-3xl font-bold text-foreground mb-2">
					Welcome Back
				</h1>
				<p className="text-sm text-muted-foreground">
					Sign in to your account to continue
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<AnimatedInput
						name="email"
						type="email"
						label="Email"
						value={formData.email}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{errors.email && <ValidationFeedback error={errors.email} />}
				</div>

				<div className="relative">
					<AnimatedInput
						name="password"
						type={showPassword ? "text" : "password"}
						label="Password"
						value={formData.password}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{formData.password && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					)}
					{errors.password && <ValidationFeedback error={errors.password} />}
				</div>

				<div className="flex justify-end">
					<a
						href="/forgot-password"
						className="text-sm text-primary hover:text-primary/80 transition-colors"
					>
						Forgot Password
					</a>
				</div>

				<div className="pt-2">
					<Button
						type="submit"
						disabled={!isFormValid || isLoading}
						className="w-full flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<SpinnerCustom />
								<span>Signing in...</span>
							</>
						) : (
							"Sign In"
						)}
					</Button>
				</div>
			</form>

			{/* <div className="mt-4"> */}
			{/*   <PasskeyButton /> */}
			{/* </div> */}

			<div className="my-6 flex items-center gap-3">
				<div className="h-px flex-1 bg-border" />
				<span className="text-xs font-medium text-muted-foreground uppercase">
					OR
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="grid grid-cols-2 gap-3">
				<SocialAuthButtons />
			</div>

			<p className="mt-6 text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<a
					href="/login"
					className="font-semibold text-primary hover:text-primary/80 transition-colors"
				>
					Sign up
				</a>
			</p>
		</div>
	);
}
