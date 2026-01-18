import {
	adminClient,
	inferAdditionalFields,
	organizationClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac } from "@/lib/rbac/permissions";
import type { auth } from "./auth";

export const authClient = createAuthClient({
	plugins: [
		inferAdditionalFields<typeof auth>(),
		twoFactorClient({
			onTwoFactorRedirect: () => {
				window.location.href = "/2fa";
			},
		}),
		adminClient({
			ac,
		}),
		organizationClient(),
	],
});
