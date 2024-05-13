import "dotenv/config";

function getAppConfig() {
  const app_jwtPrivateKey = process.env?.APP_JWT_PRIVATE_KEY ?? "";
  const trialCount = process.env?.APP_MAX_VERIFY_DUAL_AMOUNTS_TRIAL_COUNT ?? 0;
  const appMaxVerifyDualAmountTrialCount = !isNaN(Number(trialCount))
    ? Number(trialCount)
    : 0;

  const db_username = process.env?.DB_USERNAME ?? "";
  const db_password = process.env?.DB_PASSWORD;
  const db_host = process.env?.DB_HOST ?? "";
  const db_dbName = process.env?.DB_DBNAME ?? "";
  const db_port = process.env?.DB_PORT ?? "";

  const lnd_baseURL = process.env?.APP_LND_BASE_URL ?? "";
  const btcPayServer_baseURL = process.env?.APP_BTC_PAY_SERVER_URL ?? "";
  const btcPayServer_ApiKey = process.env?.APP_BTC_PAY_SERVER_API_KEY ?? "";
  const btcPayServer_storeId = process.env?.APP_BTC_PAY_SERVER_STORE_ID ?? "";

  return {
    app_jwtPrivateKey,
    db_username,
    db_host,
    db_password: !!db_password ? db_password : undefined,
    db_dbName,
    db_port,
    lnd_baseURL,
    btcPayServer_baseURL,
    btcPayServer_ApiKey,
    btcPayServer_storeId,
    appMaxVerifyDualAmountTrialCount,
    hiro_so_api_key: process.env?.HIRO_SO_API_KEY ?? "",
  };
}

export default getAppConfig;
