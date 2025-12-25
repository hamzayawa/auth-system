// test-email.ts

import { config } from "dotenv";
import { Resend } from "resend";

config();
const resend = new Resend(process.env.RESEND_API_KEY!);

async function sendEmail({
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
	return resend.emails.send({
		from: process.env.RESEND_FROM_EMAIL!,
		to, // Use coachbabaa@gmail.com here
		subject,
		html,
		text,
	});
}

async function main() {
	try {
		const response = await sendEmail({
			to: "coachbabaa@gmail.com", // Your verified email
			subject: "Test Email - Success!",
			html: "<p>Hello world! ✅ Email working correctly.</p>",
			text: "Hello world! Email working correctly.",
		});
		console.log("Email sent:", response);
	} catch (err) {
		console.error("Failed to send email:", err);
	}
}

main();
