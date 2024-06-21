import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { encryptedStore } from ".";

export interface PagesStore {}

export const pagesStateStoreName = "pagesStateStoreName";

export const pagesStateStore = createWithEqualityFn(
  persist<PagesStore>(
    () => ({
      // DEFAULT STATE
      //   ACTIONS OR MUTATORS
    }),
    {
      name: pagesStateStoreName,
      storage: encryptedStore(),
    },
  ),
  shallow,
);
