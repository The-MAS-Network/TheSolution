import { Route, Routes } from "react-router-dom";

import ChangeLanguagePage from "@/pages/ChangeLanguagePage";
import GetStartedPage from "@/pages/GetStartedPage";
import LoginPage from "@/pages/auth/LoginPage";
import routes from "./routes";
import useEnhancedCustomRouterUtilities from "./useEnhancedCustomRouterUtilities";
import RegisterPage from "@/pages/auth/RegisterPage";
import NicknamePage from "@/pages/auth/NicknamePage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProfilePage from "@/pages/dashboard/profile/ProfilePage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import EditProfilePage from "@/pages/dashboard/editProfile/EditProfilePage";
import RequireAuth from "./RequireAuth";
import PageNotFound from "@/pages/PageNotFound";

const AppRouter = (): JSX.Element => {
  useEnhancedCustomRouterUtilities();
  return (
    <Routes>
      <Route index Component={GetStartedPage} />
      <Route
        path={routes.CHANGE_LANGUAGE_PAGE}
        Component={ChangeLanguagePage}
      />

      <Route path={routes.LOGIN_PAGE} Component={LoginPage} />
      <Route path={routes.REGISTER_PAGE} Component={RegisterPage} />
      <Route
        path={routes.FORGOT_PASSWORD_PAGE}
        Component={ForgotPasswordPage}
      />
      <Route path={routes.NICKNAME_PAGE} Component={NicknamePage} />

      <Route element={<RequireAuth />}>
        <Route path={routes.DASHBOARD_PAGE} Component={DashboardLayout}>
          <Route index Component={DashboardPage} />
          <Route path={routes.PROFILE_PAGE} Component={ProfilePage} />
          <Route path={routes.EDIT_PROFILE_PAGE} Component={EditProfilePage} />
        </Route>
      </Route>

      {/* PLEASE THIS SHOULD ALWAYS BE LAST */}
      <Route path="/*" Component={PageNotFound} />
    </Routes>
  );
};

export default AppRouter;
