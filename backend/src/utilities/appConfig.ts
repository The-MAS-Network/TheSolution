import "dotenv/config";

function getAppConfig() {
  const app_jwtPrivateKey = process.env?.APP_JWT_PRIVATE_KEY ?? "";
  const trialCount = process.env?.APP_MAX_VERIFY_DUAL_AMOUNTS_TRIAL_COUNT ?? 0;
  const appMaxVerifyDualAmountTrialCount = !isNaN(Number(trialCount))
    ? Number(trialCount)
    : 0;
  const appBackendPort = process.env?.APP_BACKEND_PORT;
  const app_backend_port = !appBackendPort
    ? 8080
    : !isNaN(Number(appBackendPort))
    ? Number(appBackendPort)
    : 8080;

  const db_password = process.env?.DB_PASSWORD;

  return {
    app_jwtPrivateKey,

    app_adminJwtPrivateKey: "App-Admin" + app_jwtPrivateKey,

    app_secondary_jwtPrivateKey: "secondary" + app_jwtPrivateKey,

    appMaxVerifyDualAmountTrialCount,

    resend_api_key: process.env?.RESEND_API_KEY ?? "",

    resend_email_domain: process.env?.RESEND_EMAIL_DOMAIN ?? "",

    app_backend_port,

    db_username: process.env?.DB_USERNAME ?? "",

    db_host: process.env?.DB_HOST ?? "",

    db_password: !!db_password ? db_password : undefined,

    db_dbName: process.env?.DB_DBNAME ?? "",

    db_port: process.env?.DB_PORT ?? "",

    lnd_baseURL: process.env?.APP_LND_BASE_URL ?? "",

    app_grpc_port: process.env?.APP_GRPC_PORT,

    btcPayServer_baseURL: process.env?.APP_BTC_PAY_SERVER_URL ?? "",

    btcPayServer_ApiKey: process.env?.APP_BTC_PAY_SERVER_API_KEY ?? "",

    btcPayServer_storeId: process.env?.APP_BTC_PAY_SERVER_STORE_ID ?? "",

    hiro_so_api_key: process.env?.HIRO_SO_API_KEY ?? "",

    app_admin_email: process.env?.APP_ADMIN_EMAIL ?? "",

    app_macroon_hex: process.env?.APP_MACROON_HEX ?? "",
    appDiscordWebhookURL: process.env?.APP_DISCORD_WEBHOOK_URL ?? "",
  };
}

export default getAppConfig;
