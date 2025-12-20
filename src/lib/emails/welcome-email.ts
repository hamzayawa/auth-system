import { sendEmail } from "./send-email";

interface WelcomeEmailData {
	name: string;
	email: string;
}

export async function sendWelcomeEmail(user: WelcomeEmailData) {
	await sendEmail({
		to: user.email,
		subject: "Welcome to our platform!",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome aboard, ${user.name}!</h2>
        <p>We're excited to have you on our platform.</p>
        <p>Get started by exploring all the features we have to offer.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
		text: `Welcome aboard, ${user.name}!\n\nWe're excited to have you on our platform.\n\nGet started by exploring all the features we have to offer.\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nYour App Team`,
	});
}
