import { useTranslationStore } from "@/stores/appTranslator.store";
import appTranslate from "@/utilities/appTranslate";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";

export const useSingleTranslator = (value: string) => {
  const { currentLanguageDetails } = useStore(useTranslationStore);

  const { data } = useQuery({
    queryKey: [value],
    queryFn: () => appTranslate(value, currentLanguageDetails.languageCode),
  });

  return data;
};
