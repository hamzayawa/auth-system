import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const authSession = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session ?? null;
};

export const authIsRequired = async () => {
	const session = await authSession();

	if (!session) {
		redirect("/signin");
	}

	return session;
};

export const authIsNotRequired = async () => {
	const session = await authSession();

	if (session) {
		redirect("/dashboard");
	}
};
