import { Route, Routes } from "react-router-dom";

import ChangeLanguagePage from "@/pages/ChangeLanguagePage";
import PageNotFound from "@/pages/PageNotFound";
import LoginPage from "@/pages/auth/LoginPage";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import VerifyOTPPage from "@/pages/auth/VerifyOTPPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import routes from "./routes";
import useEnhancedCustomRouterUtilities from "./useEnhancedCustomRouterUtilities";
import OrdinalCollectionsPage from "@/pages/dashboard/ordinals/OrdinalCollectionsPage";
import OrdinalsCollectionPage from "@/pages/dashboard/ordinals/OrdinalsCollectionPage";
import InactiveOrdinals from "@/pages/dashboard/ordinals/InactiveOrdinals";
import ActiveOrdinals from "@/pages/dashboard/ordinals/ActiveOrdinals";
import RequireAuth from "./RequireAuth";

const AppRouter = (): JSX.Element => {
  useEnhancedCustomRouterUtilities();
  return (
    <Routes>
      <Route index Component={LoginPage} />
      <Route
        path={routes.CHANGE_LANGUAGE_PAGE}
        Component={ChangeLanguagePage}
      />
      <Route path={routes.VERIFY_OTP_PAGE} Component={VerifyOTPPage} />
      <Route
        path={routes.FORGOT_PASSWORD_PAGE}
        Component={ForgotPasswordPage}
      />
      <Route
        path={routes.CHANGE_PASSWORD_PAGE}
        Component={ChangePasswordPage}
      />

      <Route element={<RequireAuth />}>
        {/* <Route path={routes.DASHBOARD_PAGE} Component={DashboardLayout}> */}
        <Route path={routes.DASHBOARD_PAGE} Component={DashboardPage} />
        <Route path={routes.SETTINGS_PAGE} Component={SettingsPage} />
        <Route
          path={routes.ORDINAL_COLLECTIONS_PAGE}
          Component={OrdinalCollectionsPage}
        >
          <Route index Component={InactiveOrdinals} />
          <Route
            path={routes.ACTIVE_ORDINAL_COLLECTIONS_PAGE}
            Component={ActiveOrdinals}
          />
        </Route>
        <Route
          path={routes.ORDINAL_COLLECTION_PAGE(":id")}
          Component={OrdinalsCollectionPage}
        />
      </Route>
      {/* </Route> */}

      {/* PLEASE THIS SHOULD ALWAYS BE LAST */}
      <Route path="/*" Component={PageNotFound} />
    </Routes>
  );
};

export default AppRouter;
