"use client";
import Link from "next/link";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
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
					<>
						<h2 className="text-3xl font-bold">Welcome to Our App</h2>
						<Button asChild size="lg">
							<Link href="/signin">Sign In / Sign Up</Link>
						</Button>
					</>
					) : (
				</div>
			</div>
		</main>
	);
}
