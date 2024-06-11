export default Object.freeze({
  onboarding: "ON_BOARDING",
  forgotPassword: "FORGOT_PASSWORD",
  oridnalsTableName: "ordinals",
  ordinalCollectionIdColumnName: "ordinal_collection_id",
});

export enum OTPPurpose {
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  ON_BOARDING = "ON_BOARDING",
  TIP_USER = "Tip user",
  TIP_COLLECTION = "Tip collection",
}

export enum Currencies {
  SATS = "SATS",
  BTC = "BTC",
  USD = "USD",
}

export enum LeaderboardDurations {
  WEEKLY = "WEEKLY",
  ALL_TIME = "ALL_TIME",
}
