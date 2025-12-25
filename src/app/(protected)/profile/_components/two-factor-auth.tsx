"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth/auth-client";
import AnimatedInput from "@/components/auth/animated-input";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useId } from "react";

const twoFactorAuthSchema = z.object({
	password: z.string().min(1),
});

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>;
type TwoFactorData = {
	totpURI: string;
	backupCodes: string[];
};

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
	const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
		null,
	);
	const router = useRouter();
	const form = useForm<TwoFactorAuthForm>({
		resolver: zodResolver(twoFactorAuthSchema),
		defaultValues: { password: "" },
	});

	const { isSubmitting } = form.formState;
	const passwordId = useId();

	async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
		await authClient.twoFactor.disable(
			{
				password: data.password,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to disable 2FA");
				},
				onSuccess: () => {
					form.reset();
					router.refresh();
				},
			},
		);
	}

	async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
		const result = await authClient.twoFactor.enable({
			password: data.password,
		});

		if (result.error) {
			toast.error(result.error.message || "Failed to enable 2FA");
		}
		setTwoFactorData(result.data);
		form.reset();
	}

	if (twoFactorData != null) {
		return (
			<QRCodeVerify
				{...twoFactorData}
				onDone={() => {
					setTwoFactorData(null);
				}}
			/>
		);
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(
					isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth,
				)}
			>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor={passwordId}>Password</FormLabel>
							<FormControl>
								<AnimatedInput
									{...field}
									id={passwordId}
									name="password"
									type="password"
									label="Password"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full flex items-center justify-center gap-2"
					variant={isEnabled ? "destructive" : "default"}
				>
					{isSubmitting ? (
						<>
							<SpinnerCustom />
							<span>{isEnabled ? "Disabling 2FA..." : "Enabling 2FA..."}</span>
						</>
					) : isEnabled ? (
						"Disable 2FA"
					) : (
						"Enable 2FA"
					)}
				</Button>
			</form>
		</Form>
	);
}

const qrSchema = z.object({
	token: z.string().length(6),
});

type QrForm = z.infer<typeof qrSchema>;

function QRCodeVerify({
	totpURI,
	backupCodes,
	onDone,
}: TwoFactorData & { onDone: () => void }) {
	const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
	const router = useRouter();
	const form = useForm<QrForm>({
		resolver: zodResolver(qrSchema),
		defaultValues: { token: "" },
	});

	const { isSubmitting } = form.formState;

	async function handleQrCode(data: QrForm) {
		await authClient.twoFactor.verifyTotp(
			{
				code: data.token,
			},
			{
				onError: (error) => {
					toast.error(error.error.message || "Failed to verify code");
				},
				onSuccess: () => {
					setSuccessfullyEnabled(true);
					router.refresh();
				},
			},
		);
	}

	if (successfullyEnabled) {
		return (
			<>
				<p className="text-sm text-muted-foreground mb-2">
					Save these backup codes in a safe place. You can use them to access
					your account.
				</p>
				<div className="grid grid-cols-2 gap-2 mb-4">
					{backupCodes.map((code) => (
						<div key={code} className="font-mono text-sm">
							{code}
						</div>
					))}
				</div>
				<Button variant="outline" onClick={onDone}>
					Done
				</Button>
			</>
		);
	}

	return (
		<div className="space-y-4">
			<p className="text-muted-foreground">
				Scan this QR code with your authenticator app and enter the code below:
			</p>

			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(handleQrCode)}>
					<FormField
						control={form.control}
						name="token"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Code</FormLabel>
								<FormControl>
									<AnimatedInput
										{...field}
										name="token"
										type="text"
										label="Code"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full flex items-center justify-center gap-2"
					>
						{isSubmitting ? (
							<>
								<SpinnerCustom />
								<span>Submitting...</span>
							</>
						) : (
							"Submit Code"
						)}
					</Button>
				</form>
			</Form>
			<div className="p-4 bg-white w-fit">
				<QRCode size={256} value={totpURI} />
			</div>
		</div>
	);
}
