"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface FormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
	revokeOtherSessions: boolean;
}

interface Errors {
	currentPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export function ChangePasswordForm() {
	const [formData, setFormData] = useState<FormData>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		revokeOtherSessions: true,
	});

	const [errors, setErrors] = useState<Errors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [currentPassword, setCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	/* ----------------------- handlers ----------------------- */

	const handleChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));

		// Clear error on change
		if (errors[field as keyof Errors]) {
			setErrors((e) => ({ ...e, [field]: undefined }));
		}
	};

	/* ----------------------- validation ----------------------- */

	const validateCurrentPassword = () =>
		formData.currentPassword ? undefined : "Current password is required.";

	const validateNewPassword = () =>
		formData.newPassword.length >= 8
			? undefined
			: "Password must be at least 8 characters.";

	const validateConfirmPassword = () =>
		formData.confirmPassword === formData.newPassword
			? undefined
			: "Passwords do not match.";

	const handleBlur = (field: keyof Errors) => {
		let error: string | undefined;

		switch (field) {
			case "currentPassword":
				error = validateCurrentPassword();
				break;
			case "newPassword":
				error = validateNewPassword();
				break;
			case "confirmPassword":
				error = validateConfirmPassword();
				break;
		}

		setErrors((e) => ({ ...e, [field]: error }));
	};

	const isFormValid =
		formData.currentPassword &&
		formData.newPassword &&
		formData.confirmPassword &&
		Object.values(errors).every((e) => e === undefined) &&
		formData.newPassword === formData.confirmPassword;

	/* ----------------------- submit ----------------------- */

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isFormValid) return;

		setIsSubmitting(true);

		await authClient.changePassword(
			{
				currentPassword: formData.currentPassword,
				newPassword: formData.newPassword,
				revokeOtherSessions: formData.revokeOtherSessions,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to change password");
				},
				onSuccess: () => {
					toast.success("Password changed successfully");
					setFormData({
						currentPassword: "",
						newPassword: "",
						confirmPassword: "",
						revokeOtherSessions: true,
					});
				},
			},
		);

		setIsSubmitting(false);
	}

	/* ----------------------- UI ----------------------- */

	return (
		<motion.div
			className="w-full max-w-lg"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border p-8 font-manrope">
				<div className="relative z-10">
					<div className="text-center mb-8 font-satoshi">
						<h1 className="text-3xl font-aeonik mb-2">Change Password</h1>
						<p className="text-sm text-muted-foreground">
							Use a strong password you don’t reuse elsewhere
						</p>
					</div>

					<form
						noValidate
						onSubmit={handleSubmit}
						className="space-y-6 font-aeonik"
					>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<AnimatedInput
								id="currentPassword"
								type={currentPassword ? "text" : "password"}
								label="Current Password"
								value={formData.currentPassword}
								onChange={(val) => handleChange("currentPassword", val)}
								onBlur={() => handleBlur("currentPassword")}
								error={errors.currentPassword}
								showToggle
								showPassword={currentPassword}
								onTogglePassword={() => setCurrentPassword(!currentPassword)}
								required
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<AnimatedInput
								id="newPassword"
								type={showNewPassword ? "text" : "password"}
								label="New Password"
								value={formData.newPassword}
								onChange={(val) => handleChange("newPassword", val)}
								onBlur={() => handleBlur("newPassword")}
								error={errors.newPassword}
								showToggle
								showPassword={showNewPassword}
								onTogglePassword={() => setShowNewPassword(!showNewPassword)}
								required
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.7 }}
						>
							<PasswordStrength password={formData.newPassword} />
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
								onChange={(val) => handleChange("confirmPassword", val)}
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
									disabled={isSubmitting || !isFormValid}
									className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-full shadow-xl transition-all"
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
											Changing...
										</>
									) : (
										<>
											Change Password
											<ArrowRight className="ml-2 w-5 h-5" />
										</>
									)}
								</Button>
							</motion.div>
						</motion.div>
					</form>
				</div>
			</div>
		</motion.div>
	);
}
