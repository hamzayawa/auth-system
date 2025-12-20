import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
// import { passkey } from "better-auth/plugins/passkey"
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { twoFactor } from "better-auth/plugins/two-factor";
import { desc, eq } from "drizzle-orm";
import { ac, admin, user } from "@/components/auth/permissions";
import { db } from "@/drizzle/db";
import { member } from "@/drizzle/schema";
// import { stripe } from "@better-auth/stripe"
// import Stripe from "stripe"
// import { STRIPE_PLANS } from "./stripe"
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { env } from "@/lib/env";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";
import { sendPasswordResetEmail } from "../emails/password-reset-email";
import { sendWelcomeEmail } from "../emails/welcome-email";

// const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
//   apiVersion: "2025-08-27.basil",
// })

export const auth = betterAuth({
	appName: "Better Auth Demo",
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
		additionalFields: {
			favoriteNumber: {
				type: "number",
				required: false,
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
			// minLength: Number(env.PASSWORD_MIN_LENGTH || "8"),
			// Custom validator function for password requirements
			validator: (password: string) => {
				const minLength = password.length >= 8;
				const hasUpperCase = /[A-Z]/.test(password);
				const hasLowerCase = /[a-z]/.test(password);
				const hasNumber = /[0-9]/.test(password);
				const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
					password,
				);
				const noWhitespace = !/^\s|\s$/.test(password);

				const errors = [];

				if (!minLength)
					errors.push("Password must be at least 8 characters long");
				if (!hasUpperCase)
					errors.push("Password must contain at least one uppercase letter");
				if (!hasLowerCase)
					errors.push("Password must contain at least one lowercase letter");
				if (!hasNumber)
					errors.push("Password must contain at least one number");
				if (!hasSpecialChar)
					errors.push("Password must contain at least one special character");
				if (!noWhitespace)
					errors.push("Password must not have leading or trailing whitespace");

				return errors.length === 0 ? true : errors;
			},
		},
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail({ user, url });
		},
	},
	emailVerification: {
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
			mapProfileToUser: (profile) => {
				return {
					favoriteNumber: Number(profile.public_repos) || 0,
				};
			},
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			mapProfileToUser: () => {
				return {
					favoriteNumber: 0,
				};
			},
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60, // 1 minute
		},
	},
	plugins: [
		nextCookies(),
		twoFactor(),
		// passkey(),
		adminPlugin({
			ac,
			roles: {
				admin,
				user,
			},
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
		// stripe({
		//   // stripeClient,
		//   stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
		//   createCustomerOnSignUp: true,
		//   subscription: {
		//     authorizeReference: async ({ user, referenceId, action }) => {
		//       const memberItem = await db.query.member.findFirst({
		//         where: and(
		//           eq(member.organizationId, referenceId),
		//           eq(member.userId, user.id)
		//         ),
		//       })

		//       if (
		//         action === "upgrade-subscription" ||
		//         action === "cancel-subscription" ||
		//         action === "restore-subscription"
		//       ) {
		//         return memberItem?.role === "owner"
		//       }

		//       return memberItem != null
		//     },
		//     enabled: true,
		//     plans: STRIPE_PLANS,
		//   },
		// }),
	],
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path.startsWith("/sign-up")) {
				const user = ctx.context.newSession?.user ?? {
					name: ctx.body.name,
					email: ctx.body.email,
				};

				if (user != null) {
					await sendWelcomeEmail(user);
				}
			}
		}),
	},
	databaseHooks: {
		session: {
			create: {
				before: async (userSession) => {
					const membership = await db.query.member.findFirst({
						where: eq(member.userId, userSession.userId),
						orderBy: desc(member.createdAt),
						columns: { organizationId: true },
					});

					return {
						data: {
							...userSession,
							activeOrganizationId: membership?.organizationId,
						},
					};
				},
			},
		},
	},
});
