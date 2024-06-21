import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../navigation/routes";
import { useNavigationHistoryStore } from "../stores/navigationHistoryStore";
import { useStore } from "zustand";
// import { authStore } from "../stores/auth.store";

export const useCheckIfUserIsLoggedIn = () => {
  const [isEffectDone, setIsEffectDone] = useState(false);
  // const { loginResponse } = useStore(authStore);

  const navigate = useNavigate();
  const location = useLocation();
  const navigationStore = useStore(useNavigationHistoryStore);
  const navigationHistory = navigationStore.history;

  useEffect(() => {
    if (false) {
      // if (!!loginResponse?.data?.token) {
      const lastRoute = navigationHistory[navigationHistory.length - 1];
      if (!lastRoute) navigate(routes.LOGIN_PAGE, { replace: true });
      else {
        navigationStore.deleteLastRoute();
        navigate(lastRoute, { replace: true });
      }
    }

    setIsEffectDone(true);
  }, [location.pathname]);

  return {
    isEffectDone,
  };
};
