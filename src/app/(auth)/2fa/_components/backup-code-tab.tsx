"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import AnimatedInput from "../../login/_components/animated-input";
import { SpinnerCustom } from "@/components/ui/spinner";

const backupCodeSchema = z.object({
	code: z.string().min(1),
});

type BackupCodeForm = z.infer<typeof backupCodeSchema>;

export function BackupCodeTab() {
	const router = useRouter();
	const form = useForm<BackupCodeForm>({
		resolver: zodResolver(backupCodeSchema),
		defaultValues: {
			code: "",
		},
	});

	const { isSubmitting } = form.formState;

	async function handleBackupCodeVerification(data: BackupCodeForm) {
		await authClient.twoFactor.verifyBackupCode(data, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to verify code");
			},
			onSuccess: () => {
				router.push("/");
			},
		});
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(handleBackupCodeVerification)}
			>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Backup Code</FormLabel>
							<FormControl>
								<AnimatedInput
									{...field}
									name="code"
									type="text"
									label="Backup Code"
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
							<span>Verifying...</span>
						</>
					) : (
						"Verify"
					)}
				</Button>
			</form>
		</Form>
	);
}
