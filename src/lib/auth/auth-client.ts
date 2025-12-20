import {
	adminClient,
	inferAdditionalFields,
	organizationClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, user } from "@/components/auth/permissions";
import type { auth } from "./auth";

export const authClient = createAuthClient({
	plugins: [
		inferAdditionalFields<typeof auth>(),
		twoFactorClient({
			onTwoFactorRedirect: () => {
				window.location.href = "/auth/2fa";
			},
		}),
		adminClient({
			ac,
			roles: {
				admin,
				user,
			},
		}),
		organizationClient(),
	],
});
