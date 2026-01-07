"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

export default function Home() {
	const [hasAdminPermission, setHasAdminPermission] = useState(false);

	const { data: session } = authClient.useSession();

	// Admin permission check
	useEffect(() => {
		authClient.admin
			.hasPermission({ permission: { user: ["list"] } })
			.then(({ data }: any) => {
				setHasAdminPermission(data?.success ?? false);
			});
	}, []);

	return (
		<main className="transition-opacity duration-700 ease-out">
			<CustomCursor />
			<Navigation />

			<div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
				{/* Branding */}
				<div className="text-center mb-10">
					<h1 className="text-5xl font-bold text-black mb-4">YawaTech</h1>
					<p className="text-xl text-gray-600">
						Branding & Digital Design Agency
					</p>
				</div>

				{/* Auth Content */}
				<div className="w-full max-w-md text-center space-y-6">
					{session == null ? (
						<>
							<h2 className="text-3xl font-bold">Welcome to Our App</h2>
							<Button asChild size="lg">
								<Link href="/signin">Sign In / Sign Up</Link>
							</Button>
						</>
					) : (
						<>
							<h2 className="text-3xl font-bold">
								Welcome {session.user.name}!
							</h2>

							<div className="flex flex-wrap gap-4 justify-center">
								<Button asChild size="lg">
									<Link href="/profile">Profile</Link>
								</Button>

								<Button asChild size="lg" variant="outline">
									<Link href="/organizations">Organizations</Link>
								</Button>

								{hasAdminPermission && (
									<Button variant="outline" asChild size="lg">
										<Link href="/admin">Admin</Link>
									</Button>
								)}

								<BetterAuthActionButton
									size="lg"
									variant="destructive"
									action={() => authClient.signOut()}
								>
									Sign Out
								</BetterAuthActionButton>
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
