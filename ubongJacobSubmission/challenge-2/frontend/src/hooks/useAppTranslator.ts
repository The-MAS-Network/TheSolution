import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useTranslationStore } from "../stores/appTranslator.store";
import appTranslate from "../utilities/appTranslate";
interface Props {
  [x: string]: string;
}
export const useAppTranslator = <T>(props: Props) => {
  const {
    currentLanguageDetails,
    translatedValues: storeTranslatedValues,
    setTranslatedValues,
  } = useStore(useTranslationStore);
  const [values, setValues] = useState(props);

  const currentLanguageType = currentLanguageDetails.languageCode;

  const translateValues = async () => {
    const newValues = { ...props };

    for (let key in newValues) {
      let value = "";

      if (currentLanguageType == "en") {
        value = newValues[key];
      } else if (
        storeTranslatedValues.hasOwnProperty(
          key + newValues[key] + currentLanguageType,
        )
      ) {
        value =
          storeTranslatedValues[key + newValues[key] + currentLanguageType];
      } else {
        value = await appTranslate(newValues[key], currentLanguageType);
        setTranslatedValues(key + newValues[key] + currentLanguageType, value);
      }
      newValues[key] = value;
    }
    setValues({ ...values, ...newValues });
  };

  useEffect(() => {
    translateValues();
  }, [currentLanguageType]);

  const translatedValues = values as T;
  return {
    translatedValues,
  };
};
