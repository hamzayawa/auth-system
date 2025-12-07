import { customType } from "drizzle-orm/pg-core";

export const nanoId = (name: string) =>
  customType<{ data: string; driverData: string }>({
    dataType() {
      return "text";
    },
    toDriver: (value) => value,
    fromDriver: (value) => value,
  })(name);
