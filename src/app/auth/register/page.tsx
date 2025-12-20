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

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [favoriteNumber, setFavoriteNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSignUp(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await authClient.signUp.email({
				email,
				password,
				name,
				favoriteNumber: Number(favoriteNumber),
			});

			if (result.error) {
				toast.error(result.error.message || "Failed to sign up");
			} else {
				toast.success(
					"Account created! Please check your email to verify your account.",
				);
				router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
			}
		} catch (error) {
			toast.error("An error occurred during sign up");
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
					<CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSignUp} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
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
								minLength={8}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="favoriteNumber">Favorite Number</Label>
							<Input
								id="favoriteNumber"
								type="number"
								placeholder="42"
								value={favoriteNumber}
								onChange={(e) => setFavoriteNumber(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Sign Up"}
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link href="/login" className="text-primary hover:underline">
							Sign in
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
