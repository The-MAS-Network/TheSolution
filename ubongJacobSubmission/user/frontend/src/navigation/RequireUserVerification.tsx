import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "zustand";
import { authStore } from "../stores/auth.store";
import { useNavigationHistoryStore } from "../stores/navigationHistoryStore";
import routes from "./routes";

const RequireUserVerification = (): JSX.Element => {
  const navigationStore = useNavigationHistoryStore();
  const { loginResponse } = useStore(authStore);

  const isUserVerified = !!loginResponse?.data?.isVerified;

  useEffect(() => {
    if (!isUserVerified) {
      navigationStore.deleteLastRoute();
    }
  }, [isUserVerified]);

  return isUserVerified ? (
    <Outlet />
  ) : (
    <Navigate to={routes.DASHBOARD_PAGE} replace />
  );
};

export default RequireUserVerification;
