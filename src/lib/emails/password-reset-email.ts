import { sendEmail } from "./send-email";

interface PasswordResetData {
	user: {
		name: string;
		email: string;
	};
	url: string;
}

export async function sendPasswordResetEmail({ user, url }: PasswordResetData) {
	await sendEmail({
		to: user.email,
		subject: "Reset your password",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
		text: `Hello ${user.name},\n\nWe received a request to reset your password. Click this link to set a new password: ${url}\n\nIf you didn't request a password reset, please ignore this email.\n\nThis link will expire in 1 hour.\n\nBest regards,\nYour App Team`,
	});
}
