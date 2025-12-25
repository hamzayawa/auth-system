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
import AnimatedInput from "@/components/auth/animated-input";
import { authClient } from "@/lib/auth/auth-client";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useId } from "react";

const profileUpdateSchema = z.object({
	name: z.string().min(1),
	email: z.email().min(1),
	favoriteNumber: z.number().int(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export function ProfileUpdateForm({
	user,
}: {
	user: {
		email: string;
		name: string;
	};
}) {
	const router = useRouter();
	const form = useForm<ProfileUpdateForm>({
		resolver: zodResolver(profileUpdateSchema),
		defaultValues: {
			name: user.name,
			email: user.email,
		},
	});

	const { isSubmitting } = form.formState;

	const nameId = useId();
	const emailId = useId();

	async function handleProfileUpdate(data: ProfileUpdateForm) {
		const promises = [
			authClient.updateUser({
				name: data.name,
				favoriteNumber: data.favoriteNumber,
			}),
		];

		if (data.email !== user.email) {
			promises.push(
				authClient.changeEmail({
					newEmail: data.email,
					callbackURL: "/profile",
				}),
			);
		}

		const res = await Promise.all(promises);

		const updateUserResult = res[0];
		const emailResult = res[1] ?? { error: false };

		if (updateUserResult.error) {
			toast.error(updateUserResult.error.message || "Failed to update profile");
		} else if (emailResult.error) {
			toast.error(emailResult.error.message || "Failed to change email");
		} else {
			if (data.email !== user.email) {
				toast.success("Verify your new email address to complete the change.");
			} else {
				toast.success("Profile updated successfully");
			}
			router.refresh();
		}
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(handleProfileUpdate)}
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor={nameId}>Name</FormLabel>
							<FormControl>
								<AnimatedInput
									{...field}
									id={nameId}
									name="name"
									type="text"
									label="Name"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor={emailId}>Email</FormLabel>
							<FormControl>
								<AnimatedInput
									{...field}
									id={emailId}
									name="email"
									type="email"
									label="Email"
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
							<span>Updating...</span>
						</>
					) : (
						"Update Profile"
					)}
				</Button>
			</form>
		</Form>
	);
}
