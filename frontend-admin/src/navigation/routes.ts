export default Object.freeze({
  LOGIN_PAGE: "/",
  CHANGE_LANGUAGE_PAGE: "/change-language",
  VERIFY_OTP_PAGE: "/verify-otp",
  CHANGE_PASSWORD_PAGE: "/change-password",
  FORGOT_PASSWORD_PAGE: "/forgot-password",
  PAGE_NOT_FOUND: "page-not-found",

  // DASHBOARD PAGES
  DASHBOARD_PAGE: "/dashboard",
  SETTINGS_PAGE: "/dashboard/settings",
  ORDINAL_COLLECTIONS_PAGE: "/dashboard/ordinal-collections",
  ACTIVE_ORDINAL_COLLECTIONS_PAGE: "/dashboard/ordinal-collections/active",
  INACTIVE_ORDINAL_COLLECTIONS_PAGE: "/dashboard/ordinal-collections",
  ORDINAL_COLLECTION_PAGE: (id: string) =>
    "/dashboard/ordinal-collection/" + id,

  PAYMENTS_HISTORY_PAGE: "/dashboard/payments",
  PAYMENTS_HISTORY_DETAILS_PAGE: (id: string) => "/dashboard/payments/" + id,
  PAYMENTS_SUMMARY_PAGE: "/dashboard/payments-summary",
});
