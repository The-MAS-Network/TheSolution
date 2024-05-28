import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useTranslationStore } from "@/stores/appTranslator.store";
import { addSpaceBeforeCapitalLetters } from "@/utilities";
import appTranslate from "@/utilities/appTranslate";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

interface Props {
  message?: string;
  ignoreCapitalLetterSpacing?: boolean;
}

const ErrorMessage = ({
  message,
  ignoreCapitalLetterSpacing,
}: Props): JSX.Element | null => {
  if (!message) return null;

  const [finalMessage, setFinalMessage] = useState("");

  interface ITranslate {
    [message: string]: string;
  }

  const values: ITranslate = {
    [message]: message,
  };
  const { currentLanguageDetails } = useStore(useTranslationStore);

  const { translatedValues } = useAppTranslator<ITranslate>({ ...values });

  useEffect(() => {
    formatErrorMessage();
  }, [message, finalMessage]);

  const formatErrorMessage = async () => {
    if (
      !!translatedValues[message] &&
      translatedValues[message] === finalMessage
    )
      return;

    if (currentLanguageDetails.languageCode === "en") {
      const initMessage = translatedValues[message]?.split('"')?.join("");
      setFinalMessage(
        !ignoreCapitalLetterSpacing
          ? addSpaceBeforeCapitalLetters(initMessage)
          : initMessage,
      );
    } else if (!!translatedValues[message]) {
      setFinalMessage(translatedValues[message]);
    } else {
      const result = await appTranslate(
        message,
        currentLanguageDetails.language,
      );
      setFinalMessage(result);
    }
  };

  return (
    <p
      className={`mt-1 p-1 font-baloo2 text-sm font-medium  tracking-wider text-appYellow100 first-letter:uppercase ${!ignoreCapitalLetterSpacing && "lowercase"}`}
    >
      {finalMessage}
    </p>
  );
};

export default ErrorMessage;
