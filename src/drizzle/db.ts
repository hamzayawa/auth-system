import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as authSchema from "./schemas/auth-schema";
import * as rbacSchema from "./schemas/rbac-schema";

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(databaseUrl);

export const db = drizzle(client, {
	schema: {
		...authSchema,
		...rbacSchema,
	},
});
