import { createWithEqualityFn } from "zustand/traditional";
import { createJSONStorage, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface IPageStateStore {
  summaryPageState: SummaryPageState | null;

  setSummaryPageState: (value: SummaryPageState | null) => void;
}

const storeName = "usePageStateStore";

export const pageStateStore = createWithEqualityFn(
  persist<Readonly<IPageStateStore>>(
    (set) => ({
      // INITIAL STATE
      summaryPageState: null,

      // ACTIONS AND MUTATORS

      setSummaryPageState: (summaryPageState) =>
        set(() => ({ summaryPageState })),
    }),
    {
      name: storeName,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
  shallow,
);

interface SummaryPageState {
  id: string;
}
