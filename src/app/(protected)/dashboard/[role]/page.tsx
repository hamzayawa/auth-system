import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSessionWithRoles } from "@/lib/auth/session.server";

interface PageProps {
    params: Promise<{
        role: string;
    }>;
}

export default async function RoleDashboardPage({ params }: PageProps) {
    const { role } = await params;

    // 1. Verify Authentication & Role
    const session = await getSessionWithRoles(await headers());

    if (!session?.user) {
        redirect("/signin");
    }

    const userRoles = session.user.roles || [];

    // Check if user has this specific role (or is superadmin)
    // Check if user has this specific role (or is superadmin)
    // Dynamic route param 'role' depends on URL (e.g. 'content'), but real role might be 'ContentManager'.
    // We should check if ANY of the user's roles matches the current param case-insensitively, 
    // OR if the user has a redirect route pointing to this path.

    const hasRole = userRoles.some(r => r.toLowerCase() === role.toLowerCase());
    const isSuperAdmin = userRoles.includes("superadmin");

    if (!hasRole && !isSuperAdmin) {
        console.log(`⛔ Unauthorized access to ${role} dashboard by user with roles:`, userRoles);

        // Try to find a valid dashboard for this user
        const redirectRoutes = (session.user as any).redirectRoutes || {};
        // Find the first role that has a redirect route
        const userRedirect = userRoles.reduce((found, r) => found || redirectRoutes[r], null);

        if (userRedirect) {
            redirect(userRedirect);
        }

        redirect("/dashboard/home");
    }

    // Capitalize first letter for display
    const title = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6">
                <h1 className="text-2xl font-bold">{title} Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    This is the dynamic dashboard for the{" "}
                    <span className="font-semibold text-primary">{role}</span> role.
                </p>
            </div>
        </div>
    );
}
