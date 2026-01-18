import { seedDefaultRolesAndPermissions } from "../drizzle/seed-rbac-core";

async function main() {
	await seedDefaultRolesAndPermissions();
}

main()
	.then(() => {
		console.log("✅ Seeded default roles and permissions");
		process.exit(0);
	})
	.catch((err) => {
		console.error("❌ Error seeding RBAC:", err);
		process.exit(1);
	});
