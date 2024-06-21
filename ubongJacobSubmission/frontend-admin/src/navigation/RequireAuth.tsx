import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "zustand";
import { authStore } from "../stores/auth.store";
import { useNavigationHistoryStore } from "../stores/navigationHistoryStore";
import routes from "./routes";
import { VerifyOTPPageState } from "@/types";

const RequireAuth = (): JSX.Element => {
  const navigationStore = useNavigationHistoryStore();
  const { loginResponse } = useStore(authStore);

  const state = {
    email: loginResponse?.data?.email,
    purpose: "Change Password",
  } as VerifyOTPPageState;

  useEffect(() => {
    if (!loginResponse?.data?.token || !loginResponse?.data?.isVerified) {
      navigationStore.setRedirectedFromPath(location.pathname);
      navigationStore.deleteLastRoute();
    }
  }, [loginResponse?.data?.token, loginResponse?.data?.isVerified]);

  return !loginResponse?.data?.token ? (
    <Navigate to={routes.LOGIN_PAGE} replace />
  ) : !loginResponse?.data?.isVerified ? (
    <Navigate to={routes.VERIFY_OTP_PAGE} state={state} replace />
  ) : (
    <Outlet />
  );
};

export default RequireAuth;
