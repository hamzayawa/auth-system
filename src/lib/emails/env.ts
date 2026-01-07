import "server-only";
// src/lib/emails/env.ts
import { env } from "../env";

export const emailEnv = {
	RESEND_API_KEY: env.RESEND_API_KEY,
	RESEND_FROM_EMAIL: env.RESEND_FROM_EMAIL,
};
