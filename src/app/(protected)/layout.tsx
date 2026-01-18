import { headers } from "next/headers";
import { SessionProvider } from "./_components/SessionContext";
import { getSessionWithRoles } from "@/lib/auth/session.server";
import { requireAuth } from "@/lib/auth/guards.server";

import { SidebarProvider } from "./_components/providers/sidebar-provider";
import { ThemeProvider } from "./_components/providers/theme-provider";
import { ThemeCustomizer } from "./_components/theme-customizer";
import { LayoutWrapper } from "./LayoutWrapper";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSessionWithRoles(await headers());

	requireAuth(session);

	return (
		<ThemeProvider>
			<SessionProvider session={session}>
				<SidebarProvider>
					<LayoutWrapper>{children}</LayoutWrapper>
					<ThemeCustomizer />
				</SidebarProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}
