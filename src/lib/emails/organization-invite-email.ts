import { env } from "../env";
import { sendEmail } from "./send-email";

interface OrganizationInviteData {
	email: string;
	organization: {
		name: string;
	};
	inviter: {
		name: string;
		email: string;
	};
	invitation: {
		id: string;
	};
}

export async function sendOrganizationInviteEmail({
	email,
	organization,
	inviter,
	invitation,
}: OrganizationInviteData) {
	const inviteUrl = `${env.BETTER_AUTH_URL || "http://localhost:3000"}/invite/${invitation.id}`;

	await sendEmail({
		to: email,
		subject: `You've been invited to join ${organization.name}`,
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You've been invited!</h2>
        <p>${inviter.name} (${inviter.email}) has invited you to join ${organization.name}.</p>
        <p>Click the button below to accept the invitation:</p>
        <a href="${inviteUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Accept Invitation</a>
        <p>If you don't want to join this organization, you can safely ignore this email.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
		text: `${inviter.name} (${inviter.email}) has invited you to join ${organization.name}.\n\nClick this link to accept: ${inviteUrl}\n\nIf you don't want to join this organization, you can safely ignore this email.\n\nBest regards,\nYour App Team`,
	});
}
