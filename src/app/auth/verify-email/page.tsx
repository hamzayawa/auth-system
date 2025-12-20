import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailVerification } from "./_components/email-verification";

export default async function VerifyEmailPage({
	searchParams,
}: {
	searchParams: Promise<{ email?: string }>;
}) {
	const { email = "" } = await searchParams;

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Verify Your Email
					</CardTitle>
				</CardHeader>
				<CardContent>
					<EmailVerification email={email} />
				</CardContent>
			</Card>
		</div>
	);
}
