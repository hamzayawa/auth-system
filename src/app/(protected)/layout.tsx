import { SidebarProvider } from "./dashboard/_components/providers/sidebar-provider";
import { ThemeProvider } from "./dashboard/_components/providers/theme-provider";
import { ThemeCustomizer } from "./dashboard/_components/theme-customizer";
import { LayoutWrapper } from "./LayoutWrapper";

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ThemeProvider>
			<SidebarProvider>
				<LayoutWrapper>{children}</LayoutWrapper>
				<ThemeCustomizer />
			</SidebarProvider>
		</ThemeProvider>
	);
}
