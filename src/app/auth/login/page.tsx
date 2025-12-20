"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSignIn(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await authClient.signIn.email({
				email,
				password,
			});

			if (result.error) {
				if (result.error.message?.includes("verify")) {
					toast.error("Please verify your email before signing in");
					router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
				} else {
					toast.error(result.error.message || "Failed to sign in");
				}
			} else {
				toast.success("Signed in successfully!");
				router.push("/");
			}
		} catch (error) {
			toast.error("An error occurred during sign in");
		} finally {
			setIsLoading(false);
		}
	}

	async function handleGithubSignIn() {
		await authClient.signIn.social({
			provider: "github",
			callbackURL: "/",
		});
	}

	async function handleDiscordSignIn() {
		await authClient.signIn.social({
			provider: "discord",
			callbackURL: "/",
		});
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">Sign In</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSignIn} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="flex justify-end">
							<Link
								href="/forgot-password"
								className="text-sm text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Signing in..." : "Sign In"}
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						Don't have an account?{" "}
						<Link href="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</div>
				</CardContent>

				<Separator />

				<CardFooter className="grid grid-cols-2 gap-3">
					<Button variant="outline" onClick={handleGithubSignIn}>
						GitHub
					</Button>
					<Button variant="outline" onClick={handleDiscordSignIn}>
						Discord
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
