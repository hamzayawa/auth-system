// lib/emails/send-email.ts
import { Resend } from "resend";
import { emailEnv } from "./env";

console.log("🔑 RESEND_API_KEY:", !!emailEnv.RESEND_API_KEY); // Add this
console.log("📧 RESEND_FROM_EMAIL:", emailEnv.RESEND_FROM_EMAIL); // Add this

const resend = new Resend(emailEnv.RESEND_API_KEY);

export async function sendEmail({
	// Make async explicit
	to,
	subject,
	html,
	text,
}: {
	to: string;
	subject: string;
	html: string;
	text: string;
}) {
	const result = await resend.emails.send({
		// Ensure await
		from: emailEnv.RESEND_FROM_EMAIL,
		to,
		subject,
		html,
		text,
	});
	console.log("📤 Resend response:", result); // Add this
	return result;
}
