import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "zustand";
import { authStore } from "../stores/auth.store";
import { useNavigationHistoryStore } from "../stores/navigationHistoryStore";
import routes from "./routes";

const RequireAuth = (): JSX.Element => {
  const navigationStore = useNavigationHistoryStore();
  const { loginResponse } = useStore(authStore);

  useEffect(() => {
    if (!loginResponse?.data?.token) {
      navigationStore.setRedirectedFromPath(location.pathname);
      navigationStore.deleteLastRoute();
    }
  }, [loginResponse?.data?.token]);

  return loginResponse?.data?.token ? (
    <Outlet />
  ) : (
    <Navigate to={routes.LOGIN_PAGE} replace />
  );
};

export default RequireAuth;
