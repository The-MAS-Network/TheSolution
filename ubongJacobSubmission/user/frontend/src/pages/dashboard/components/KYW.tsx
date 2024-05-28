import KYWIcon from "@/assets/icons/KYWIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import { authStore } from "@/stores/auth.store";
import { CreateInvoiceParams } from "@/types/api/auth.types";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";

const pageValues = [
  "Know Your Wallet",
  "YOUR ACCOUNT IS UNVERIFIED",
  "Verify your Lightning Address to unlock access",
  "Verify Account",
  "KYW",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const KYW = (): JSX.Element => {
  const { closeActiveModal } = useStore(appStateStore);
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const { loginResponse } = useStore(authStore);
  const navigate = useNavigate();

  const handleVerification = () => {
    closeActiveModal();
    navigate(routes.RESET_PASSWORD_INSTRUCTIONS_PAGE, {
      state: {
        lightningAddress: loginResponse?.data?.lightningAddress,
        purpose: "verify_account",
      } as CreateInvoiceParams,
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center rounded-3xl bg-appRed500 px-10 py-5 font-lato font-normal text-white">
      <KYWIcon />

      <Icon
        onClick={() => closeActiveModal()}
        icon="zondicons:close-outline"
        className="absolute right-5 top-5 cursor-pointer text-3xl transition-all duration-300 hover:text-appYellow100"
      />
      <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
        {translatedValues?.KYW}
      </h2>
      <h3 className="text-sm sm:text-base">
        {translatedValues?.["Know Your Wallet"]}
      </h3>
      <h4 className="font-baloo2 text-base font-bold sm:text-lg">
        {translatedValues?.["YOUR ACCOUNT IS UNVERIFIED"]}
      </h4>
      <h5 className="max-w-72 text-center font-baloo2 text-sm font-normal sm:text-base">
        {translatedValues?.["Verify your Lightning Address to unlock access"]}
      </h5>

      <button
        type="button"
        onClick={handleVerification}
        className="mt-4 w-full rounded-xl bg-appYellow500 px-6 py-3 font-baloo2 text-base text-white transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {translatedValues?.["Verify Account"]}
      </button>
    </div>
  );
};

export default KYW;
