import "dotenv/config";

function getAppConfig() {
  const appPort = process.env?.APP_PORT;
  const app_port = !appPort
    ? 8080
    : !isNaN(Number(appPort))
    ? Number(appPort)
    : 8080;
  const db_password = process.env?.DB_PASSWORD;

  return {
    app_jwtPrivateKey: process.env?.APP_JWT_PRIVATE_KEY ?? "",
    app_secondary_jwtPrivateKey: "secondary" + process.env?.APP_JWT_PRIVATE_KEY,
    app_port,
    app_admin_email: process.env?.APP_ADMIN_EMAIL ?? "",
    resend_api_key: process.env?.RESEND_API_KEY ?? "",
    resend_email_domain: process.env?.RESEND_EMAIL_DOMAIN ?? "",
    hiro_so_api_key: process.env?.HIRO_SO_API_KEY ?? "",

    db_username: process.env?.DB_USERNAME ?? "",
    db_host: process.env?.DB_HOST ?? "",
    db_password: !!db_password ? db_password : undefined,
    db_dbName: process.env?.DB_DBNAME ?? "",
    db_port: Number(process.env?.DB_PORT ?? ""),
  };
}

export default getAppConfig;
