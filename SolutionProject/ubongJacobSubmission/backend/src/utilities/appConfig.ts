function getAppConfig() {
  const app_jwtPrivateKey = process.env?.APP_JWT_PRIVATE_KEY ?? "";
  const app_cryptoJsKey = process.env?.APP_CRYPTO_JS_KEY ?? "";

  const db_username = process.env?.DB_USERNAME ?? "";
  const db_password = process.env?.DB_PASSWORD;
  const db_host = process.env?.DB_HOST ?? "";
  const db_dbName = process.env?.DB_DBNAME ?? "";
  const db_port = process.env?.DB_PORT ?? "";

  return {
    app_jwtPrivateKey,
    app_cryptoJsKey,
    db_username,
    db_host,
    db_password,
    db_dbName,
    db_port,
  };
}

export default getAppConfig;
