"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClearForm } from "@/hooks/use-clear-form";
import { authClient } from "@/lib/auth/auth-client";
import { SocialAuthButtons } from "./social-auth-buttons";

interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface ValidationErrors {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

const initialFormData: FormData = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export default function SignUpForm({
	openEmailVerificationTab,
}: {
	openEmailVerificationTab: (email: string) => void;
}) {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// // Initial loading animation
	// useEffect(() => {
	// 	const timer = setTimeout(() => {
	// 		setIsLoading(false);
	// 	}, 4000);

	// 	return () => clearTimeout(timer);
	// }, []);
	useClearForm(setFormData, initialFormData);

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateField = (field: keyof FormData): string | undefined => {
		const value = formData[field].trim();

		switch (field) {
			case "name":
				return value ? undefined : "Name is required.";
			case "email":
				return /\S+@\S+\.\S+/.test(value)
					? undefined
					: "Please enter a valid email address.";
			case "password":
				if (value.length < 8) return "Password must be at least 8 characters.";
				if (!/[a-z]/.test(value)) return "Must contain a lowercase letter.";
				if (!/[A-Z]/.test(value)) return "Must contain an uppercase letter.";
				if (!/\d/.test(value)) return "Must contain a number.";
				if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
					return "Must contain a special character.";
				return undefined;
			case "confirmPassword":
				return value === formData.password
					? undefined
					: "Passwords do not match.";
			default:
				return undefined;
		}
	};

	const handleBlur = (field: keyof FormData) => {
		const error = validateField(field);
		setErrors((prev) => ({ ...prev, [field]: error }));
	};

	const isFormValid =
		formData.name &&
		formData.email &&
		formData.password &&
		formData.confirmPassword &&
		Object.values(errors).every((e) => e === undefined);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isFormValid) return;

		setIsSubmitting(true);

		const res = await authClient.signUp.email(
			{
				name: formData.name,
				email: formData.email,
				password: formData.password,
				// favoriteNumber: 0, // REQUIRED by your Better Auth config
				callbackURL: "/dashboard",
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to sign up");
				},
			},
		);

		setIsSubmitting(false);

		if (res.error == null && !res.data.user.emailVerified) {
			openEmailVerificationTab(formData.email);
		}
	}

	return (
		<motion.div
			className="w-full max-w-lg"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className="bg-white/80 backdrop-blur-xl font-heading rounded-3xl shadow-2xl border p-8 ">
				<div className="relative z-10">
					<motion.div className="text-center mb-8 font-heading">
						<Badge className="mb-4">
							<Sparkles className="w-4 h-4 mr-2" />
							Join Us Today
						</Badge>

						<h1 className="text-3xl font-heading-600 mb-2">
							Create your account
						</h1>
						<p className="text-gray-600">Fill in your details to get started</p>
					</motion.div>

					<form
						autoComplete="off"
						noValidate
						onSubmit={handleSubmit}
						className="space-y-6 font-body"
					>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<AnimatedInput
								id="name"
								type="text"
								label="Full Name"
								value={formData.name}
								onChange={(v) => handleInputChange("name", v)}
								onBlur={() => handleBlur("name")}
								error={errors.name}
								required
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<AnimatedInput
								id="email"
								type="email"
								label="Email Address"
								value={formData.email}
								onChange={(v) => handleInputChange("email", v)}
								onBlur={() => handleBlur("email")}
								error={errors.email}
								required
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<AnimatedInput
								id="password"
								type={showPassword ? "text" : "password"}
								label="Password"
								value={formData.password}
								onChange={(v) => handleInputChange("password", v)}
								onBlur={() => handleBlur("password")}
								error={errors.password}
								showToggle
								showPassword={showPassword}
								onTogglePassword={() => setShowPassword(!showPassword)}
								required
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.7 }}
						>
							<PasswordStrength password={formData.password} />
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<AnimatedInput
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								label="Confirm Password"
								value={formData.confirmPassword}
								onChange={(v) => handleInputChange("confirmPassword", v)}
								onBlur={() => handleBlur("confirmPassword")}
								error={errors.confirmPassword}
								showToggle
								showPassword={showConfirmPassword}
								onTogglePassword={() =>
									setShowConfirmPassword(!showConfirmPassword)
								}
								required
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.9 }}
						>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 10 }}
							>
								<Button
									type="submit"
									className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group ${
										isSubmitting ? "opacity-80 cursor-not-allowed" : ""
									}`}
									disabled={!isFormValid || isSubmitting}
								>
									{isSubmitting ? (
										<>
											<LoadingSpinner
												size={20}
												barWidth={2}
												barLength={5}
												numBars={12}
												className="mr-2"
											/>
											Creating account...
										</>
									) : (
										<>
											Create Account
											<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
										</>
									)}
								</Button>
							</motion.div>
						</motion.div>
					</form>

					{/* Email signup form */}
					{/* Footer */}
					<motion.div
						className="mt-8 text-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 1.0 }}
					>
						<div className="relative mb-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-white/80 text-gray-500 font-medium">
									or
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3 font-inter">
							<SocialAuthButtons />
						</div>
						<p className="text-gray-600">
							Already have an account?{" "}
							<Link
								href="/login"
								className="font-semibold transition-colors duration-200"
								style={{
									color: "#059669",
									textDecoration: "none",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = "#047857";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = "#059669";
								}}
							>
								Sign in here
							</Link>
						</p>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}
