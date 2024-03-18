import { createWithEqualityFn } from "zustand/traditional";
import { createJSONStorage, persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { CurrentLanguageDetails } from "../types";

interface IAppTranslationStore {
  currentLanguageDetails: CurrentLanguageDetails;

  translatedValues: { [x: string]: string };

  setCurrentLanguageType: (value: CurrentLanguageDetails) => void;
  setTranslatedValues: (key: string, value: string) => void;
}

const storeName = "useTranslationStore";

export const useTranslationStore = createWithEqualityFn(
  persist<Readonly<IAppTranslationStore>>(
    (set, get) => ({
      // INITIAL STATE
      currentLanguageDetails: {
        countryName: "United Kingdom (British)",
        languageCode: "en",
        countryFlag: "emojione-v1:flag-for-united-states",
        language: "English",
      },
      translatedValues: {},

      // ACTIONS AND MUTATORS
      setCurrentLanguageType: (currentLanguageDetails) =>
        set(() => ({ currentLanguageDetails })),

      setTranslatedValues: (key, value) =>
        set(() => ({
          translatedValues: {
            ...get().translatedValues,
            ...{ [key]: value },
          },
        })),
      //   clearTranslatedValues: () => set(() => ({ translatedValues: {} })),
    }),
    {
      name: storeName,
      storage: createJSONStorage(() => localStorage),
    }
  ),
  shallow
);
