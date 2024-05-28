import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import getAppConfig from "../utilities/appConfig";
import * as schema from "./schema";

const { db_host, db_dbName, db_password, db_port, db_username } =
  getAppConfig();

const poolConnection = mysql.createPool({
  host: db_host,
  user: db_username,
  database: db_dbName,
  password: db_password,
  port: db_port,
});

export const db = drizzle(poolConnection, {
  schema,
  mode: "default",
});
