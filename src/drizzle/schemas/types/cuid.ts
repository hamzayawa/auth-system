import { customType } from "drizzle-orm/pg-core";

export const cuidColumn = (name: string) =>
	customType<{ data: string; driverData: string }>({
		dataType: () => "text",
		toDriver: (value) => value,
		fromDriver: (value) => value,
	})(name);
