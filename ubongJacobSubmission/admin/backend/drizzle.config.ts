import { defineConfig } from "drizzle-kit";

import getAppConfig from "./src/utilities/appConfig";

const { db_host, db_password, db_dbName, db_port, db_username } =
  getAppConfig();

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: db_host,
    database: db_dbName,
    port: db_port,
    password: db_password,
    user: db_username,
  },
  strict: true,
  verbose: true,
});
