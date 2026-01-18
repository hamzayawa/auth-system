import { sendEmail } from "./send-email";

interface SendOtpEmailData {
	user: {
		name?: string | null;
		email: string;
	};
	otp: string;
}

export async function sendOtpEmail({ user, otp }: SendOtpEmailData) {
	const name = user.name ?? "there";

	await sendEmail({
		to: user.email,
		subject: "Your security code",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Security Code</h2>
        <p>Hello ${name},</p>
        <p>Use the code below to complete your sign-in:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          text-align: center;
          margin: 24px 0;
        ">
          ${otp}
        </div>

        <p>This code will expire in a few minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>

        <p style="margin-top: 32px;">
          Best regards,<br />
          Your App Team
        </p>
      </div>
    `,
		text: `
Hello ${name},

Your security code is:

${otp}

This code will expire in a few minutes.

If you didn’t request this, please ignore this email.

Best regards,
Your App Team
    `,
	});
}
