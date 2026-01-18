import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { twoFactor } from "better-auth/plugins/two-factor";
import { desc, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { member } from "@/drizzle/schema";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { env } from "@/lib/env";
import { ac as permissionsAc, roles } from "@/lib/rbac/admin-roles";
import { validatePassword } from "@/lib/validation";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendOtpEmail } from "../emails/send-otp";
import { sendWelcomeEmail } from "../emails/welcome-email";

export const auth = betterAuth({
	appName: "Better Auth Demo",
	// Make sure this matches your app URL (e.g. http://localhost:3000 in dev)
	baseURL: env.BETTER_AUTH_URL,

	// Core role names stored on the user (e.g. user.role)
	roles: {
		superadmin: {},
		admin: {},
		user: {},
		tailwindcss: {},
	},

	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async ({ user, url, newEmail }) => {
				await sendEmailVerificationEmail({
					user: { ...user, email: newEmail },
					url,
				});
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url }) => {
				await sendDeleteAccountVerificationEmail({ user, url });
			},
		},
	},

	emailAndPassword: {
		enabled: true,
		password: {
			hash: hashPassword,
			verify: verifyPassword,
		},
		passwordValidation: {
			validator: (password: string) => {
				const error = validatePassword(password);
				return error ? [error] : true;
			},
		},
		// Require verification before email+password login
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail({ user, url });
		},
	},

	emailVerification: {
		// After clicking verification link, automatically create a session
		autoSignInAfterVerification: true,
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmailVerificationEmail({ user, url });
		},
	},

	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			mapProfileToUser: () => ({}),
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			mapProfileToUser: () => ({}),
		},
	},

	session: {
		// Cookie cache improves performance for get-session calls in App Router.[web:50]
		cookieCache: { enabled: true, maxAge: 60 },
		// Optional: uncomment if you want a custom cookie name
		// cookieName: "better-auth.session",
	},

	plugins: [
		// Required for Next.js to read/write cookies correctly.[web:46]
		nextCookies(),

		twoFactor({
			otpOptions: {
				async sendOTP({ user, otp }) {
					await sendOtpEmail({ user, otp });
				},
			},
		}),

		adminPlugin({
			// Access-control statements + roles defined in admin-roles.ts
			ac: permissionsAc,
			roles,
			defaultRole: "user",
		}),

		organization({
			sendInvitationEmail: async ({
				email,
				organization,
				inviter,
				invitation,
			}) => {
				await sendOrganizationInviteEmail({
					invitation,
					inviter: inviter.user,
					organization,
					email,
				});
			},
		}),
	],

	// Drizzle adapter, same DB as your other Drizzle code.[web:46]
	database: drizzleAdapter(db, { provider: "pg" }),

	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			// Run ONLY on signup
			if (!ctx.path.startsWith("/signup")) return;

			const user = ctx.context.newSession?.user ?? {
				name: ctx.body.name,
				email: ctx.body.email,
			};

			if (user) {
				await sendWelcomeEmail(user);
			}
		}),
	},

	databaseHooks: {
		session: {
			create: {
				before: async (userSession) => {
					// Attach activeOrganizationId to session based on latest membership
					const membership = await db.query.member.findFirst({
						where: eq(member.userId, userSession.userId),
						orderBy: desc(member.createdAt),
						columns: { organizationId: true },
					});

					return {
						data: {
							...userSession,
							activeOrganizationId: membership?.organizationId || null,
						},
					};
				},
			},
		},
	},
});
