import getAppConfig from "../utilities/appConfig";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: getAppConfig().db_host,
  port: Number(getAppConfig().db_port),
  username: getAppConfig().db_username,
  password: getAppConfig().db_password,
  database: getAppConfig().db_dbName,
  // entities: ["dist/**/*.entity.js"],
  // entities: [User],
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: ["dist/db/migrations/*.js"],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
