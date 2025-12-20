/**
 * nanoId column
 * Use only for tokens, references, public IDs
 * Do NOT use for relational IDs
 */
import { customType } from "drizzle-orm/pg-core";

export const nanoId = (name: string) =>
	customType<{ data: string; driverData: string }>({
		dataType() {
			return "text";
		},
		toDriver(value: string) {
			return value;
		},
		fromDriver(value: string) {
			return value;
		},
	})(name);
