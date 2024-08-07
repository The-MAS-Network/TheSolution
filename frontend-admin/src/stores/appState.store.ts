import { AppModalProps, QuickActionTypes } from "@/types";
import { useStore } from "zustand";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface AppStateStore {
  activeModal: AppModalProps | null;
  activeQuickAction: QuickActionTypes | null;
  isQuickActionEdit: boolean;
  isDashboardSidebarVisible: boolean;
  ordinalIdsInCollection: string[];
  isAppModalLoading: boolean;

  closeActiveModal: () => void;
  toggleDashboardSidebarVisibility: (value: boolean) => void;
  setActiveModal: (value: AppModalProps) => void;
  setActiveQuickAction: (value: QuickActionTypes | null) => void;
  setIsQuickActionEdit: (value: boolean) => void;
  addordinalIdInCollection: (value: string) => void;
  clearOrdinalIdsInCollection: () => void;
  setIsAppModalLoading: (value: boolean) => void;
}

export const appStateStore = createWithEqualityFn<AppStateStore>(
  (set, get) => ({
    activeModal: null,
    isDashboardSidebarVisible: false,
    activeQuickAction: null,
    isQuickActionEdit: false,
    ordinalIdsInCollection: [],
    isAppModalLoading: false,

    closeActiveModal: () => set(() => ({ activeModal: null })),

    setIsAppModalLoading: (isAppModalLoading) => set({ isAppModalLoading }),

    toggleDashboardSidebarVisibility: (value) =>
      set({ isDashboardSidebarVisible: value }),
    setActiveModal: (activeModal) => set(() => ({ activeModal })),
    setIsQuickActionEdit: (isQuickActionEdit) =>
      set(() => ({ isQuickActionEdit })),
    setActiveQuickAction: (activeQuickAction) =>
      set(() => ({ activeQuickAction })),

    clearOrdinalIdsInCollection: () => {
      const ids = get().ordinalIdsInCollection;
      if (ids?.length > 0) {
        set(() => ({ ordinalIdsInCollection: [] }));
      }
    },

    addordinalIdInCollection: (id) => {
      const ids = get().ordinalIdsInCollection;

      if (!ids.includes(id)) {
        set(() => ({ ordinalIdsInCollection: [...ids, id] }));
      }
    },
  }),
  shallow,
);

export const useAppStateStore = () => {
  return useStore(appStateStore);
};
