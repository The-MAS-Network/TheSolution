export default Object.freeze({
  LOGIN_PAGE: "/",
  CHANGE_LANGUAGE_PAGE: "/change-language",
  VERIFY_OTP_PAGE: "/verify-otp",
  CHANGE_PASSWORD_PAGE: "/change-password",
  FORGOT_PASSWORD_PAGE: "/forgot-password",

  // DASHBOARD PAGES
  DASHBOARD_PAGE: "/dashboard",
  SETTINGS_PAGE: "/dashboard/settings",
  ORDINAL_COLLECTIONS_PAGE: "/dashboard/ordinal-collections",
  ACTIVE_ORDINAL_COLLECTIONS_PAGE: "/dashboard/ordinal-collections/active",
  INACTIVE_ORDINAL_COLLECTIONS_PAGE: "/dashboard/ordinal-collections",
  ORDINAL_COLLECTION_PAGE: (id: string) =>
    "/dashboard/ordinal-collection/" + id,
});
