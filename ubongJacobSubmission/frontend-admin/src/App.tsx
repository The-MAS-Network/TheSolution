import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AllModals from "./components/modals/AllModals";
import AppRouter from "./navigation/AppRouter";
import { checkAppConfig } from "./utilities/appConfig";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 180_000, //number in milliseconds equals to 5 minutes,
    },
  },
});

checkAppConfig();

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="mx-auto max-w-[200rem] font-baloo2">
          <AppRouter />
          <AllModals />
          {/* <SiteUnderMaintenance /> */}
        </div>
        <Toaster richColors position="top-right" theme="light" />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
