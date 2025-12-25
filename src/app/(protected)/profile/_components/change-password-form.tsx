"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import AnimatedInput from "@/components/auth/animated-input";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useId } from "react";

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(6),
	revokeOtherSessions: z.boolean(),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
	const form = useForm<ChangePasswordForm>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			revokeOtherSessions: true,
		},
	});

	const { isSubmitting } = form.formState;

	// Generate unique IDs
	const currentPasswordId = useId();
	const newPasswordId = useId();

	async function handlePasswordChange(data: ChangePasswordForm) {
		await authClient.changePassword(data, {
			onError: (error) => {
				toast.error(error.error.message || "Failed to change password");
			},
			onSuccess: () => {
				toast.success("Password changed successfully");
				form.reset();
			},
		});
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(handlePasswordChange)}
			>
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<AnimatedInput
									{...field}
									id={currentPasswordId}
									name="currentPassword"
									type="password"
									label="Current Password"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<AnimatedInput
									{...field}
									id={newPasswordId}
									name="newPassword"
									type="password"
									label="New Password"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="pt-2">
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full flex items-center justify-center gap-2"
					>
						{isSubmitting ? (
							<>
								<SpinnerCustom />
								<span>Changing password...</span>
							</>
						) : (
							"Change Password"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
