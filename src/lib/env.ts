import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		BETTER_AUTH_SECRET: z.string().min(8),
		BETTER_AUTH_URL: z.string().url(),
		DATABASE_URL: z.string().url(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),

		PASSWORD_MIN_LENGTH: z.coerce.number().min(1),

		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),

		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),

		RESEND_API_KEY: z.string(),
		RESEND_FROM_EMAIL: z.string(),
		ARCJET_API_KEY: z.string(),

		// POSTMARK_SERVER_TOKEN: z.string(),

		// STRIPE_SECRET_KEY: z.string(),
		// STRIPE_PUBLISHABLE_KEY: z.string(),
		// STRIPE_WEBHOOK_SECRET: z.string(),
		// STRIPE_BASIC_PRICE_ID: z.string(),
		// STRIPE_PRO_PRICE_ID: z.string(),

		// Flutterwave
		FLW_PUBLIC_KEY: z.string(),
		FLW_SECRET_KEY: z.string(),
		FLW_ENCRYPTION_KEY: z.string(),
		FLW_WEBHOOK_HASH: z.string(),
	},

	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
	},

	runtimeEnv: {
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,

		PASSWORD_MIN_LENGTH: process.env.PASSWORD_MIN_LENGTH,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

		RESEND_API_KEY: process.env.RESEND_API_KEY,
		RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,

		ARCJET_API_KEY: process.env.ARCJET_API_KEY,

		// POSTMARK_SERVER_TOKEN: process.env.POSTMARK_SERVER_TOKEN,
		// POSTMARK_FROM_EMAIL: process.env.POSTMARK_FROM_EMAIL,

		// STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		// STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
		// STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		// STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID,
		// STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,

		// Flutterwave
		FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
		FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
		FLW_ENCRYPTION_KEY: process.env.FLW_ENCRYPTION_KEY,
		FLW_WEBHOOK_HASH: process.env.FLW_WEBHOOK_HASH,

		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
});
