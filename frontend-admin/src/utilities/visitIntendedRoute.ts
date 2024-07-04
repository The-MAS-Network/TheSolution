import { useNavigationHistoryStore } from "@/stores/navigationHistoryStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";

interface Props {
  condition: boolean;
  otherParams?: {
    customIntendedRoutes: Readonly<string[]>;
    defaultRoute: string;
    defaultRouteState?: any;
  };
}

export const useVisitIntendedRoute = ({ condition, otherParams }: Props) => {
  const [isEffectDone, setIsEffectDone] = useState(false);
  const navigate = useNavigate();
  const navigationStore = useStore(useNavigationHistoryStore);
  const navigationHistory = navigationStore.history;

  useEffect(() => {
    if (condition) {
      if (otherParams) {
        const intent = otherParams.customIntendedRoutes.find(
          (intendedRoute) =>
            intendedRoute === navigationHistory[navigationHistory.length - 1],
        );
        if (!!intent) {
          navigationStore.deleteLastRoute();
          navigate(intent, { replace: true });
        } else {
          navigationStore.deleteLastRoute();
          navigate(otherParams.defaultRoute, {
            replace: true,
            state: otherParams.defaultRouteState,
          });
        }
      } else {
        const lastRoute = navigationHistory[navigationHistory.length - 1];

        if (!lastRoute) navigate("/page-not-found", { replace: true });
        else {
          navigationStore.deleteLastRoute();
          navigate(lastRoute, { replace: true });
        }
      }
    }
    setIsEffectDone(true);
  }, []);

  return {
    isEffectDone,
  };
};
