import AppBackButton from "@/components/AppBackButton";
import AppLoader from "@/components/AppLoader";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useVerifyUserOrdinalTransaction } from "@/hooks/useGetRequests";
import { appStateStore } from "@/stores/appState.store";
import { authStore } from "@/stores/auth.store";
import { copyTextToClipboard } from "@/utilities";
import { Icon } from "@iconify/react";
import QRCode from "react-qr-code";
import { useStore } from "zustand";
import DisconnectWalletModal from "../components/DisconnectWalletModal";

const paymentAmount = "Any amount";
const paymentDollarAmount = "";

const pageValues = [
  "Wallet Verification",
  "SCAN QR CODE WITH ANOTHER DEVICE",
  "Copy Unique Payment Address:",
  "Amount to Pay:",
  // "Payment Unique Address:",
  "Copy",
  "Waiting for payment to receive one confirmation",
  "Expires in",
  "Only pay one-time verification fee from this Wallet Address:",
  "DISCONNECT WALLET",
  paymentAmount,
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const WalletVerificationSubPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const { setActiveModal } = useStore(appStateStore);
  const { getUserData } = useStore(authStore);
  const onChainAddress = getUserData()?.ordinalWallet?.onChainWallet ?? "";

  const handleDisconnectWallet = () => {
    setActiveModal({
      modalType: "Type two",
      modalChildComponent: <DisconnectWalletModal />,
      shouldBackgroundClose: true,
    });
  };

  const { isPending, isLoading } = useVerifyUserOrdinalTransaction();

  const isPageLoading = isPending || isLoading;

  return (
    <>
      <header className="sticky  top-0 flex w-full flex-wrap items-center  justify-between gap-9 bg-appBlue100 pb-10">
        <AppBackButton />

        <AppLoader isActive={isPageLoading} />
        <button
          type="button"
          disabled={isPageLoading}
          onClick={handleDisconnectWallet}
          className="rounded-xl  bg-appBlue800 p-3 text-sm transition-all duration-300 hover:bg-appYellow500/90 hover:text-appYellow700 sm:text-base"
        >
          {translatedValues?.["DISCONNECT WALLET"]}
        </button>
      </header>

      <div className="mb-7 w-full rounded-2xl bg-appBlue160 p-4">
        <p className="text-base font-bold sm:text-lg">
          {translatedValues?.["Only pay one-time verification fee from this Wallet Address:"]}
        </p>

        <p className="custom-break-words flex-1   text-base font-semibold text-appYellow300">
          {getUserData()?.ordinalWallet?.address ?? ""}
        </p>
      </div>

      <div className="w-full rounded-2xl bg-appBlue160 p-4">
        <h1 className="text-base font-bold sm:text-lg">
          {translatedValues["Copy Unique Payment Address:"]}
        </h1>
        {/* <h2 className="mb-1 mt-4 text-sm font-normal">
          {translatedValues?.["Payment Unique Address:"]}
        </h2> */}

        <ul className="flex items-center justify-between gap-10">
          <p className="custom-break-words flex-1  text-base font-semibold text-appYellow300">
            {onChainAddress}
          </p>

          <button
            onClick={() =>
              copyTextToClipboard({
                errorText: "An error occured while copying wallet address. ",
                successText: "Wallet address copied succesfully.",
                text: onChainAddress,
              })
            }
            type="button"
            className="flex items-center gap-1 rounded-full bg-appBlue150 px-3 py-2 text-sm font-normal transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span>{translatedValues?.Copy}</span>
            <Icon
              icon="solar:copy-bold"
              className="text-lg md:text-xl lg:text-2xl"
            />
          </button>
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-0 pb-5 pt-10">
          <h2 className="text-base font-bold sm:text-lg">
            {translatedValues?.["Amount to Pay:"]} {"  "} {paymentDollarAmount}
          </h2>

          <div className="w-full">
            <p className="truncate text-base font-semibold text-appYellow300 md:text-lg lg:text-xl">
              {translatedValues?.["Any amount"]}
            </p>
          </div>
        </div>

        {/* <ul className="mt-4 flex items-center justify-between gap-3">
          <p className="flex-1 truncate  text-base font-semibold text-appYellow300 md:text-lg lg:text-xl">
            {paymentAmount}
          </p>

          <button
            type="button"
            onClick={() =>
              copyTextToClipboard({
                errorText: "An error occured while copying payment amount. ",
                successText: "Payment amount copied succesfully.",
                text: paymentAmount,
              })
            }
            className="flex items-center gap-1 rounded-full bg-appBlue150 px-3 py-2 text-sm font-normal transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span>{translatedValues.Copy}</span>
            <Icon
              icon="solar:copy-bold"
              className="text-lg md:text-xl lg:text-2xl"
            />
          </button>
        </ul> */}

        {/* <ul className="mt-7 flex items-center justify-between gap-3">
          <p className="flex-1 truncate text-base font-semibold text-appYellow300 md:text-lg lg:text-xl">
            {translatedValues["Expires in"]}
          </p>

          <dl className="flex items-center gap-1 rounded-full bg-appBlue150 px-3 py-2 text-sm font-normal transition-all duration-300 hover:scale-110 active:scale-95">
            <dd>15:00</dd>
            <Icon
              icon="icon-park-twotone:time"
              className="text-lg md:text-xl lg:text-2xl"
            />
          </dl>
        </ul> */}
      </div>

      <div className="flex flex-col items-center justify-center">
        <Icon
          className="text-4xl text-appBlue130  md:text-5xl lg:text-6xl"
          icon="bi:three-dots"
        />

        <p className="mb-7 mt-1 text-appLight200">
          {translatedValues?.["Waiting for payment to receive one confirmation"]}
        </p>
      </div>
      <button
        disabled={isPageLoading}
        type="button"
        onClick={() =>
          setActiveModal({
            modalType: "Type two",
            modalChildComponent: (
              <QRCodeModal
                btnTitle={translatedValues?.Copy}
                copyValue={onChainAddress}
                value={`bitcon:${onChainAddress}`}
              />
            ),
          })
        }
        className="app-button-secondary flex items-center justify-center gap-x-2 !py-5 disabled:text-opacity-50"
      >
        <span>{translatedValues["SCAN QR CODE WITH ANOTHER DEVICE"]}</span>
      </button>
    </>
  );
};

export default WalletVerificationSubPage;

interface QRCodeModalProps {
  value: string;
  btnTitle: string;
  copyValue: string;
}

function QRCodeModal({ btnTitle, copyValue }: QRCodeModalProps) {
  const { closeActiveModal } = useStore(appStateStore);

  return (
    <div className="flex flex-col items-center   rounded-3xl bg-appBlue140 p-7">
      <div className="flex w-full justify-end pb-8">
        <Icon
          onClick={closeActiveModal}
          className=" cursor-pointer text-2xl text-white md:text-3xl lg:text-4xl"
          icon="line-md:close-circle-twotone"
        />
      </div>

      <QRCode
        className="aspect-square h-max w-full max-w-80"
        value={copyValue}
      />
      <button
        onClick={() =>
          copyTextToClipboard({
            errorText: "An error occured while copying wallet address. ",
            successText: "Wallet address copied succesfully.",
            text: copyValue,
          })
        }
        className="mt-9  flex items-center justify-between gap-3 text-white"
      >
        <span>{btnTitle}</span>
        <Icon
          className=" cursor-pointer text-2xl text-white md:text-2xl "
          icon="solar:copy-bold"
        />
      </button>
    </div>
  );
}
