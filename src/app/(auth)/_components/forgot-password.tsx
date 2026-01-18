"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

interface FormData {
	email: string;
}

interface ValidationErrors {
	email?: string;
}

const initialFormData: FormData = {
	email: "",
};

export function ForgotPasswordForm({
	openSignInTab,
}: {
	openSignInTab: () => void;
}) {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (value: string) => {
		setFormData({ email: value });
		if (errors.email) {
			setErrors({});
		}
	};

	const validateEmail = (): string | undefined => {
		return /\S+@\S+\.\S+/.test(formData.email.trim())
			? undefined
			: "Please enter a valid email address.";
	};

	const handleBlur = () => {
		const error = validateEmail();
		setErrors({ email: error });
	};

	const isFormValid =
		formData.email && Object.values(errors).every((e) => e === undefined);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isFormValid) return;

		setIsSubmitting(true);

		await authClient.requestPasswordReset(
			{
				email: formData.email,
				redirectTo: "/reset-password",
			},
			{
				onError: (error) => {
					toast.error(
						error.error.message || "Failed to send password reset email",
					);
				},
				onSuccess: () => {
					toast.success("Password reset email sent");
				},
			},
		);

		setIsSubmitting(false);
	}

	return (
		<motion.div
			className="w-full max-w-md"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
		>
			<form
				autoComplete="off"
				noValidate
				onSubmit={handleSubmit}
				className="space-y-6"
			>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					<AnimatedInput
						id="email"
						type="email"
						label="Email Address"
						value={formData.email}
						onChange={handleInputChange}
						onBlur={handleBlur}
						error={errors.email}
						required
					/>
				</motion.div>

				<div className="flex gap-2">
					<Button type="button" variant="outline" onClick={openSignInTab}>
						Back
					</Button>

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
										Sending...
									</>
								) : (
									<>
										Send Reset Email
										<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
									</>
								)}
							</Button>
						</motion.div>
					</motion.div>
				</div>
			</form>
		</motion.div>
	);
}
