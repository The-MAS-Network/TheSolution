import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "zustand";
import { useNavigationHistoryStore } from "../stores/navigationHistoryStore";
import { appStateStore } from "@/stores/appState.store";

function useEnhancedCustomRouterUtilities(): void {
  const { history, setHistory } = useStore(useNavigationHistoryStore);
  const { pathname } = useLocation();
  const {
    activeQuickAction,
    isQuickActionEdit,
    setIsQuickActionEdit,
    setActiveQuickAction,
  } = useStore(appStateStore);

  // Scroll to top if path changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  //   TRACK BROWSER HISTORY FOR 404 NOT FOUND PAGE
  let initialized = false;
  useEffect(() => {
    if (!initialized) {
      initialized = true;
      if (history[history.length - 1] !== pathname) setHistory(pathname);
    }

    if (activeQuickAction !== null) {
      setActiveQuickAction(null);
    }
    if (!!isQuickActionEdit) {
      setIsQuickActionEdit(false);
    }
  }, [pathname]);
}

export default useEnhancedCustomRouterUtilities;
