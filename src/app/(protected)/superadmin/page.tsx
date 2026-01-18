import { getAuditLogs } from "@/lib/rbac/audit";
import SuperadminDashboardClient from "./_components/SuperadminDashboardClient";

export default async function SuperadminDashboard() {
	const logs = await getAuditLogs(50);

	return <SuperadminDashboardClient logs={logs} />;
}
