import { Link } from "react-router-dom";
import { useStore } from "zustand";
import { Icon } from "@iconify/react";

import routes from "@/navigation/routes";
import { useTranslationStore } from "@/stores/appTranslator.store";
import { twMerge } from "tailwind-merge";
import { useAppTranslator } from "@/hooks/useAppTranslator";

interface Props {
  className?: string;
}

interface ITranslate {
  [message: string]: string;
}

const ChangeLanguageButton = ({ className }: Props): JSX.Element => {
  const { currentLanguageDetails } = useStore(useTranslationStore);
  const values: ITranslate = {
    [currentLanguageDetails?.language]: currentLanguageDetails?.language,
  };
  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  return (
    <Link
      to={routes.CHANGE_LANGUAGE_PAGE}
      className={twMerge(
        "mt-7 flex  w-full items-center justify-between rounded-2xl bg-appBlue300 px-3 py-4 text-sm text-white outline-0 sm:text-base",
        className,
      )}
    >
      <span className="flex items-center gap-x-2">
        <Icon className="text-base sm:text-xl" icon="clarity:world-solid" />
        <p className="font-semibold">
          {translatedValues[currentLanguageDetails.language]}
        </p>
      </span>

      <span className="flex items-center gap-x-2">
        <Icon
          className="text-base sm:text-xl"
          icon={currentLanguageDetails.countryFlag}
        />
        <Icon
          className="-rotate-90 text-base text-white sm:text-xl"
          icon="iconamoon:arrow-down-2-bold"
        />
      </span>
    </Link>
  );
};

export default ChangeLanguageButton;
