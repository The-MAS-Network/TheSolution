import { drizzle } from "drizzle-orm/mysql2";
import getAppConfig from "../utilities/appConfig";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql2 from "mysql2/promise";
import path from "path";

const { db_host, db_password, db_dbName, db_port, db_username } =
  getAppConfig();

const doMigrate = async () => {
  try {
    const dbConnection = await mysql2.createConnection({
      host: db_host,
      database: db_dbName,
      port: db_port,
      password: db_password,
      user: db_username,
    });

    const dbMigrator = drizzle(dbConnection);

    await migrate(dbMigrator, {
      migrationsFolder: path.resolve("src", "drizzle", "migrations"),
    });

    await dbConnection.end();
    console.log("🚀 Migration done 🎉");
    process.exit(0);
  } catch (error) {
    console.log(`☹️  Migration error: `, error);
    process.exit(0);
  }
};

doMigrate();
