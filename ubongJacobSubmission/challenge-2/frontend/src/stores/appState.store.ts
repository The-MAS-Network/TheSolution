import { AppModalProps } from "@/types";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface AppStateStore {
  activeModal: AppModalProps | null;
  isDashboardSidebarVisible: boolean;

  closeActiveModal: () => void;
  toggleDashboardSidebarVisibility: (value: boolean) => void;
  setActiveModal: (value: AppModalProps) => void;
}

export const appStateStore = createWithEqualityFn<AppStateStore>(
  (set) => ({
    activeModal: null,
    isDashboardSidebarVisible: false,

    closeActiveModal: () => set(() => ({ activeModal: null })),
    toggleDashboardSidebarVisibility: (value) =>
      set({ isDashboardSidebarVisible: value }),
    setActiveModal: (activeModal) => set(() => ({ activeModal })),
  }),
  shallow,
);
