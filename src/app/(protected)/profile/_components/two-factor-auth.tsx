"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import { AnimatedInput } from "@/components/auth/animated-input";
import { LoadingSpinner } from "@/components/auth/loading-spinner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface TwoFactorData {
	totpURI: string;
	backupCodes: string[];
}

interface Errors {
	password?: string;
	token?: string;
}

/* ------------------------------------------------------------------ */
/* Main Component */
/* ------------------------------------------------------------------ */

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
	const router = useRouter();

	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<Errors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
		null,
	);
	const [showPassword, setShowPassword] = useState(false);

	/* ----------------------- validation ----------------------- */

	const validatePassword = () =>
		password.length > 0 ? undefined : "Password is required.";

	const handlePasswordBlur = () => {
		setErrors((e) => ({ ...e, password: validatePassword() }));
	};

	const isFormValid = password && !errors.password;

	/* ----------------------- submit ----------------------- */

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!isFormValid) return;

		setIsSubmitting(true);

		if (isEnabled) {
			await authClient.twoFactor.disable(
				{ password },
				{
					onError: (error) => {
						toast.error(error.error.message || "Failed to disable 2FA");
					},
					onSuccess: () => {
						toast.success("Two-factor authentication disabled");
						setPassword("");
						router.refresh();
					},
				},
			);
		} else {
			const result = await authClient.twoFactor.enable({ password });

			if (result.error) {
				toast.error(result.error.message || "Failed to enable 2FA");
			} else {
				setTwoFactorData(result.data);
				setPassword("");
			}
		}

		setIsSubmitting(false);
	}

	if (twoFactorData) {
		return (
			<QRCodeVerify {...twoFactorData} onDone={() => setTwoFactorData(null)} />
		);
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
						<h1 className="text-3xl font-aeonik mb-2">
							Two-Factor Authentication
						</h1>
						<p className="text-muted-foreground text-sm">
							{isEnabled
								? "Disable extra account security"
								: "Add an extra layer of protection"}
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
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<AnimatedInput
								id="password"
								type={showPassword ? "text" : "password"}
								label="Password"
								value={password}
								onChange={setPassword}
								onBlur={handlePasswordBlur}
								error={errors.password}
								showToggle
								showPassword={showPassword}
								onTogglePassword={() => setShowPassword(!showPassword)}
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
									className={`w-full px-8 py-4 text-lg rounded-full shadow-xl transition-all ${
										isEnabled
											? "bg-red-600 hover:bg-red-700"
											: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
									}`}
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
											{isEnabled ? "Disabling..." : "Enabling..."}
										</>
									) : (
										<>
											{isEnabled ? "Disable 2FA" : "Enable 2FA"}
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

/* ------------------------------------------------------------------ */
/* QR CODE VERIFICATION */
/* ------------------------------------------------------------------ */

function QRCodeVerify({
	totpURI,
	backupCodes,
	onDone,
}: TwoFactorData & { onDone: () => void }) {
	const router = useRouter();

	const [token, setToken] = useState("");
	const [errors, setErrors] = useState<Errors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [enabled, setEnabled] = useState(false);

	const validateToken = () =>
		token.length === 6 ? undefined : "Enter a 6-digit code.";

	const handleTokenBlur = () => {
		setErrors((e) => ({ ...e, token: validateToken() }));
	};

	const isFormValid = token && !errors.token;

	async function handleVerify(e: React.FormEvent) {
		e.preventDefault();
		if (!isFormValid) return;

		setIsSubmitting(true);

		await authClient.twoFactor.verifyTotp(
			{ code: token },
			{
				onError: (error) => {
					toast.error(error.error.message || "Invalid code");
				},
				onSuccess: () => {
					toast.success("Two-factor authentication enabled");
					setEnabled(true);
					router.refresh();
				},
			},
		);

		setIsSubmitting(false);
	}

	if (enabled) {
		return (
			<motion.div
				className="w-full max-w-lg"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border p-8">
					<h2 className="text-xl font-aeonik mb-4">Backup Codes</h2>

					<p className="text-sm text-muted-foreground mb-4">
						Save these codes somewhere safe. Each code can be used once.
					</p>

					<div className="grid grid-cols-2 gap-2 mb-6">
						{backupCodes.map((code) => (
							<div
								key={code}
								className="font-mono text-sm bg-muted rounded-md px-3 py-2"
							>
								{code}
							</div>
						))}
					</div>

					<Button className="w-full" onClick={onDone}>
						Done
					</Button>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className="w-full max-w-lg"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border p-8 space-y-6">
				<p className="text-muted-foreground text-sm">
					Scan the QR code with your authenticator app and enter the 6-digit
					code.
				</p>

				<div className="p-4 bg-white rounded-xl w-fit mx-auto">
					<QRCode size={200} value={totpURI} />
				</div>

				<form onSubmit={handleVerify} className="space-y-6">
					<AnimatedInput
						id="token"
						type="text"
						label="Authentication Code"
						value={token}
						onChange={setToken}
						onBlur={handleTokenBlur}
						error={errors.token}
						required
					/>

					<Button
						type="submit"
						disabled={isSubmitting || !isFormValid}
						className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 text-lg rounded-full shadow-xl"
					>
						{isSubmitting ? (
							<>
								<LoadingSpinner className="mr-2" />
								Verifying...
							</>
						) : (
							<>
								Verify Code
								<ArrowRight className="ml-2 w-5 h-5" />
							</>
						)}
					</Button>
				</form>
			</div>
		</motion.div>
	);
}
