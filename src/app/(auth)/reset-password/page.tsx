"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedInput } from "@/components/auth/animated-input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import {
	type PasswordStrength,
	validateConfirmPassword,
	validatePasswordWithStrength,
} from "@/lib/validation";
import ValidationFeedback from "../../(auth)/_components/validation-feedback";
import { LoadingSpinner } from "@/components/auth/loading-spinner";

interface FormData {
	password: string;
	confirmPassword: string;
}

interface ValidationErrors {
	[key: string]: string | null;
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const error = searchParams.get("error");

	const [formData, setFormData] = useState<FormData>({
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [passwordStrength, setPasswordStrength] =
		useState<PasswordStrength | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const isFormValid =
		formData.password &&
		formData.confirmPassword &&
		!errors.password &&
		!errors.confirmPassword &&
		passwordStrength !== null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Real-time password strength check
		if (name === "password") {
			const { error, strength } = validatePasswordWithStrength(value);
			setErrors((prev) => ({ ...prev, password: error }));
			setPasswordStrength(strength);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let error: string | null = null;

		switch (name) {
			case "password": {
				const result = validatePasswordWithStrength(value);
				error = result.error;
				setPasswordStrength(result.strength);
				break;
			}
			case "confirmPassword":
				error = validateConfirmPassword(value, formData.password);
				break;
		}

		setErrors((prev) => ({ ...prev, [name]: error }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid || !token) return;

		setIsLoading(true);

		await authClient.resetPassword(
			{
				newPassword: formData.password,
				token,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to reset password");
				},
				onSuccess: () => {
					toast.success("Password reset successful", {
						description: "Redirecting to login...",
					});
					setTimeout(() => {
						router.push("/");
					}, 1000);
				},
			},
		);

		setIsLoading(false);
	};

	// Invalid or expired token state
	if (token == null || error != null) {
		return (
			<main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
				<div className="w-full max-w-md animate-fade-in">
					<div className="mb-8 text-center">
						<h1 className="text-balance text-3xl font-bold text-foreground mb-2">
							Invalid Reset Link
						</h1>
						<p className="text-sm text-muted-foreground">
							The password reset link is invalid or has expired.
						</p>
					</div>

					<Button asChild className="w-full">
						<Link href="/">Back to Login</Link>
					</Button>
				</div>
			</main>
		);
	}

	return (
		<motion.div
			className="w-full max-w-lg"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
				<div className="w-full max-w-md animate-fade-in">
					<div className="mb-8 text-center">
						<h1 className="text-balance text-3xl font-bold text-foreground mb-2">
							Reset Your Password
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your new password below
						</p>
					</div>

					<form
						autoComplete="off"
						noValidate
						onSubmit={handleSubmit}
						className="space-y-6 font-aeonik"
					>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<div className="relative">
								<AnimatedInput
									id="password"
									type={showPassword ? "text" : "password"}
									label="New Password"
									value={formData.password}
									onChange={(value) =>
										handleChange({
											target: { name: "password", value },
										} as React.ChangeEvent<HTMLInputElement>)
									}
									onBlur={() =>
										handleBlur({
											target: { name: "password", value: formData.password },
										} as React.FocusEvent<HTMLInputElement>)
									}
								/>

								{formData.password && (
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								)}
								{errors.password && (
									<ValidationFeedback error={errors.password} />
								)}
								{passwordStrength && (
									<ValidationFeedback strength={passwordStrength} />
								)}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.7 }}
						>
							<div className="relative">
								<AnimatedInput
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									label="Confirm Password"
									value={formData.confirmPassword}
									onChange={(value) =>
										handleChange({
											target: { name: "confirmPassword", value },
										} as React.ChangeEvent<HTMLInputElement>)
									}
									onBlur={() =>
										handleBlur({
											target: {
												name: "confirmPassword",
												value: formData.confirmPassword,
											},
										} as React.FocusEvent<HTMLInputElement>)
									}
								/>

								{formData.confirmPassword && (
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
										aria-label={
											showConfirmPassword ? "Hide password" : "Show password"
										}
									>
										{showConfirmPassword ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								)}
								{errors.confirmPassword && (
									<ValidationFeedback error={errors.confirmPassword} />
								)}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 10 }}
							>
								<Button
									type="submit"
									className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group ${
										isLoading ? "opacity-80 cursor-not-allowed" : ""
									}`}
									disabled={!isFormValid || isLoading}
								>
									{isLoading ? (
										<>
											<LoadingSpinner
												size={20}
												barWidth={2}
												barLength={5}
												numBars={12}
												className="mr-2"
											/>
											Resetting...
										</>
									) : (
										<>
											Reset Password
											<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
										</>
									)}
								</Button>
							</motion.div>
						</motion.div>
					</form>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Remember your password?{" "}
						<Link
							href="/"
							className="font-semibold text-primary hover:text-primary/80 transition-colors"
						>
							Sign in
						</Link>
					</p>
				</div>
			</main>
		</motion.div>
	);
}
