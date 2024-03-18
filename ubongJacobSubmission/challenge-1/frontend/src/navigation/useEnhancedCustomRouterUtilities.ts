import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "zustand";
import { useNavigationHistoryStore } from "../stores/navigationHistoryStore";

function useEnhancedCustomRouterUtilities(): void {
  const { history, setHistory } = useStore(useNavigationHistoryStore);
  const { pathname } = useLocation();

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
  }, [pathname]);
}

export default useEnhancedCustomRouterUtilities;
