import { useAppTranslator } from "@/hooks/useAppTranslator";
import { authStore } from "@/stores/auth.store";
import { useStore } from "zustand";
import NoOrdinalWalletSubPage from "./subPages/NoOrdinalWalletSubPage";
import VerifiedOrdinalWalletSubPage from "./subPages/VerifiedOrdinalWalletSubPage";
import WalletVerificationSubPage from "./subPages/WalletVerificationSubPage";
import BroadcastedPaymentSubPage from "./subPages/BroadcastedPaymentSubPage";
import { useGetProfile } from "@/hooks/useGetRequests";
import AppLoader from "@/components/AppLoader";

const pageValues = [
  "Ordinals",
  "Wallet",
  "DISCONNECT WALLET",
  "RESCAN WALLET",
  "VERIFY YOUR ORDINALS WALLET",
  "No ordinal found in this ordinal wallet.",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalsPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const { isLoading, isPending, isFetching } = useGetProfile();

  const isPageLoading = isLoading || isPending || isFetching;

  const { getUserData } = useStore(authStore);
  const walletStatus = getUserData()?.ordinalWallet;

  return (
    <main className="app-container-lg h-full min-h-screen flex-col items-center  justify-center pt-10 font-baloo2 font-medium text-white md:flex">
      <section className="mx-auto w-full max-w-[26rem]">
        {isPageLoading ? (
          <AppLoader isActive isDeepBlur />
        ) : !walletStatus ? (
          <NoOrdinalWalletSubPage
            ordinal={translatedValues?.Ordinals}
            wallet={translatedValues?.Wallet}
            verify={translatedValues?.["VERIFY YOUR ORDINALS WALLET"]}
          />
        ) : !!walletStatus?.isVerified ? (
          <VerifiedOrdinalWalletSubPage
            rescanWalletTitle={translatedValues?.["RESCAN WALLET"]}
            disconnectWalletTitle={translatedValues?.["DISCONNECT WALLET"]}
            errorMessage={
              translatedValues?.["No ordinal found in this ordinal wallet."]
            }
          />
        ) : !!walletStatus?.isBroadcasted && !walletStatus?.isVerified ? (
          <BroadcastedPaymentSubPage />
        ) : (
          <WalletVerificationSubPage />
        )}
      </section>
    </main>
  );
};

export default OrdinalsPage;
