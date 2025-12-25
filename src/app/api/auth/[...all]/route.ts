import { findIp } from "@arcjet/ip";
import arcjet, {
	type BotOptions,
	detectBot,
	type EmailOptions,
	protectSignup,
	type SlidingWindowRateLimitOptions,
	shield,
	slidingWindow,
} from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/auth";
import { env } from "@/lib/env";

const aj = arcjet({
	key: env.ARCJET_API_KEY,
	characteristics: ["userIdOrIp"],
	rules: [shield({ mode: "LIVE" })],
});

const botSettings = {
	mode: "LIVE",
	allow: ["CURL"],
} satisfies BotOptions;

const restrictiveRateLimitSettings = {
	mode: "LIVE",
	max: 10,
	interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const laxRateLimitSettings = {
	mode: "LIVE",
	max: 60,
	interval: "1m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const emailSettings = {
	mode: "LIVE",
	block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const authHandlers = toNextJsHandler(auth);
export const { GET } = authHandlers;

export async function POST(request: Request) {
	const clonedRequest = request.clone();

	let body: unknown = null;
	try {
		body = await request.json();
	} catch {
		body = null;
	}

	const decision = await checkArcjet(request, body);

	if (decision.isDenied()) {
		if (decision.reason.isRateLimit()) {
			return new Response(null, { status: 429 });
		}

		if (decision.reason.isEmail()) {
			let message = "Invalid email.";

			if (decision.reason.emailTypes.includes("INVALID")) {
				message = "Email address format is invalid.";
			} else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
				message = "Disposable email addresses are not allowed.";
			} else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
				message = "Email domain is not valid.";
			}

			return Response.json({ message }, { status: 400 });
		}

		return new Response(null, { status: 403 });
	}

	return authHandlers.POST(clonedRequest);
}

async function checkArcjet(request: Request, body: unknown) {
	const session = await auth.api.getSession({ headers: request.headers });
	const userIdOrIp = (session?.user.id ?? findIp(request)) || "127.0.0.1";

	if (request.url.endsWith("/sign-up")) {
		if (
			body &&
			typeof body === "object" &&
			"email" in body &&
			typeof (body as any).email === "string"
		) {
			return aj
				.withRule(
					protectSignup({
						email: emailSettings,
						bots: botSettings,
						rateLimit: restrictiveRateLimitSettings,
					}),
				)
				.protect(request, {
					email: (body as any).email,
					userIdOrIp,
				});
		}

		return aj
			.withRule(detectBot(botSettings))
			.withRule(slidingWindow(restrictiveRateLimitSettings))
			.protect(request, { userIdOrIp });
	}

	return aj
		.withRule(detectBot(botSettings))
		.withRule(slidingWindow(laxRateLimitSettings))
		.protect(request, { userIdOrIp });
}
