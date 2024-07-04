import AppBackButton from "@/components/AppBackButton";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { CreateInvoicePurpose } from "@/types/api/auth.types";
import { copyTextToClipboard } from "@/utilities";
import { Icon } from "@iconify/react/dist/iconify.js";
import QRCode from "react-qr-code";

interface Props {
  onVerify: () => void;
  destination: string;
  isLoading: boolean;
  purpose: CreateInvoicePurpose;
}

const pageValues = [
  "To reset your password we need to verify ownership of your Lightning Address.",
  "To verify your account we need to verify ownership of your Lightning Address.",
  "Scan invoice",
  "Or",
  "Copy",
  "Already Sent SATs",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const VerifyOwnership = ({
  onVerify,
  destination,
  isLoading,
  purpose,
}: Props): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  return (
    <>
      <AppBackButton isPrevious />
      <h1 className="mb-16 mt-12 text-left text-lg font-medium text-white sm:mb-8 sm:mt-6 sm:text-left">
        {purpose === "forgot_password"
          ? translatedValues?.[
              "To reset your password we need to verify ownership of your Lightning Address."
            ]
          : translatedValues[
              "To verify your account we need to verify ownership of your Lightning Address."
            ]}
      </h1>

      <section className="mx-auto mb-9 max-w-max rounded-xl bg-white p-2">
        <QRCode
          className="aspect-square  h-max w-full max-w-52"
          value={destination}
        />
      </section>

      <section className="mb-5 flex flex-col items-center justify-center text-sm font-bold sm:text-base">
        <p>{translatedValues?.["Scan invoice"]}</p>
        <p className=" my-5 sm:my-1">{translatedValues?.Or}</p>
        <button
          onClick={() =>
            copyTextToClipboard({
              text: destination,
              errorText: "Unable to copy invoice details to clipboard.",
              successText: "Invoice details successfully copied to clipboard.",
            })
          }
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:text-appYellow100 active:scale-95"
          type="button"
        >
          <span className="font-normal">{translatedValues?.Copy}</span>
          <Icon icon="solar:copy-bold" />
        </button>
      </section>

      <button
        onClick={onVerify}
        type="button"
        disabled={isLoading}
        className="app-button-primary  flex items-center justify-center gap-x-2 !bg-transparent !text-appYellow100 !shadow-none !duration-200 hover:!bg-appBlue400 hover:!text-white hover:!shadow-appButtonInnerShadow"
      >
        <span>{translatedValues?.["Already Sent SATs"]} </span>
        {isLoading && <SpinnerIcon className="animate-spin" />}
      </button>
    </>
  );
};

export default VerifyOwnership;
