"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export function BackupCodeTab() {
	const router = useRouter();

	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	/* ----------------------------- validation ----------------------------- */
	const validateCode = () =>
		code.trim().length > 0 ? undefined : "Backup code is required.";

	const handleBlur = () => {
		setError(validateCode() ?? null);
	};

	const isFormValid = code.trim().length > 0 && !error;

	/* ----------------------------- submit ----------------------------- */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isFormValid) {
			setError(validateCode() ?? null);
			return;
		}

		setIsSubmitting(true);

		try {
			await authClient.twoFactor.verifyBackupCode(
				{ code: code.trim() },
				{
					onError: (err) => {
						toast.error(err.error?.message || "Failed to verify code");
					},
					onSuccess: () => {
						toast.success("Backup code verified successfully");
						router.push("/dashboard");
					},
				},
			);
		} catch (err: any) {
			toast.error(err.message || "Something went wrong");
		}

		setIsSubmitting(false);
	};

	/* ----------------------------- UI ----------------------------- */
	return (
		<div className="w-full max-w-lg">
			<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border p-8 font-manrope">
				<h1 className="text-3xl font-aeonik mb-6 text-center">
					Use Backup Code
				</h1>

				<form onSubmit={handleSubmit} className="space-y-6">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<AnimatedInput
							id="backup-code"
							type="text"
							label="Backup Code"
							value={code}
							onChange={setCode}
							onBlur={handleBlur}
							error={error || undefined}
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
								disabled={!isFormValid || isSubmitting}
								className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-full flex items-center justify-center gap-2"
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
										Verifying...
									</>
								) : (
									"Verify"
								)}
							</Button>
						</motion.div>
					</motion.div>
				</form>
			</div>
		</div>
	);
}
