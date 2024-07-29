import { Icon } from "@iconify/react";
import { useStore } from "zustand";

import demoLanguages from "@/assets/data/demoLanguages";
import AppBackButton from "@/components/AppBackButton";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useTranslationStore } from "@/stores/appTranslator.store";
import { CurrentLanguageDetails } from "@/types";
import { useNavigate } from "react-router-dom";

interface ITranslate {
  whatIsYour: string;
  language: string;
  selectALanguage: string;
  confirm: string;
}

const generateLanguageKey = (languageDetails: CurrentLanguageDetails) => {
  return (languageDetails.countryName + languageDetails.language).replace(
    /\s/g,
    "",
  );
};

const convertedArray = demoLanguages.map((languageDetails) => ({
  [generateLanguageKey(languageDetails)]: languageDetails.language,
}));

const mergedObject = convertedArray.reduce((accumulator, currentValue) => {
  return { ...accumulator, ...currentValue };
}, {});

const values: ITranslate = {
  whatIsYour: "What is your",
  language: "language?",
  selectALanguage: "Select a language to get started.",
  confirm: "CONFIRM",
  ...mergedObject,
};

const ChangeLanguagePage = (): JSX.Element => {
  const { currentLanguageDetails, setCurrentLanguageType } =
    useStore(useTranslationStore);

  const navigate = useNavigate();

  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  return (
    <div className="min-h-screen  items-center justify-center bg-appDarkBlue100 md:flex">
      <main className="app-container flex min-h-screen flex-col text-white md:min-h-max ">
        <header className="mb-11 pt-12">
          <AppBackButton />
        </header>

        {/* <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues.whatIsYour} <br /> {translatedValues.language}
        </h1> */}
        <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
          {translatedValues.whatIsYour} {translatedValues.language}
        </h1>

        <p className="pb-6 pt-3 text-sm font-normal duration-[30000ms] hover:text-red-600 hover:brightness-200 sm:text-base">
          {translatedValues.selectALanguage}
        </p>

        <ul className="flex flex-1 flex-col gap-y-2">
          {demoLanguages.map((details, key) => {
            return (
              <li
                onClick={() => setCurrentLanguageType(details)}
                key={key}
                className="flex cursor-pointer items-center rounded-lg border-[2px] border-appGray100 px-3 py-4 text-sm font-semibold transition-all duration-300 hover:border-appBlue200 hover:bg-appBlue200 sm:text-base"
              >
                <Icon
                  className="text-xl sm:text-2xl"
                  icon={details.countryFlag}
                />
                <span className="flex-1 px-2">
                  {/* @ts-ignore */}
                  {translatedValues[generateLanguageKey(details)]}
                </span>

                {currentLanguageDetails.languageCode ===
                  details.languageCode && (
                  <Icon
                    icon="line-md:confirm-circle"
                    className="text-xl sm:text-2xl"
                    key={key}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="py-6 md:pt-12">
          <button
            onClick={() => navigate(-1)}
            className="app-button-primary block text-center"
          >
            {translatedValues.confirm}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ChangeLanguagePage;
