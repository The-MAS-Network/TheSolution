import AppBackButton from "@/components/AppBackButton";
import AppLoader from "@/components/AppLoader";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useVerifyUserOrdinalTransaction } from "@/hooks/useGetRequests";
import { authStore } from "@/stores/auth.store";
import { Link } from "react-router-dom";
import { useStore } from "zustand";

const pageValues = [
  "VIEW IN BLOCK EXPLORER",
  "We have detected your verification fee and are currently awaiting its confirmation on the network. You may proceed to your home page the verification will be done once the payment has received at least 1 confirmation on the network.",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const BroadcastedPaymentSubPage = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const { getUserData } = useStore(authStore);

  const txID = getUserData()?.ordinalWallet?.transactionId ?? "";

  const { isRefetching, isPending, isLoading } =
    useVerifyUserOrdinalTransaction();

  const isPageLoading = isRefetching || isPending || isLoading;

  return (
    <>
      <AppBackButton />
      <AppLoader isActive={isPageLoading} />

      <p className="my-10 text-center font-baloo2 text-base font-semibold md:text-lg lg:text-xl">
        Transaction in Progress
      </p>

      <div className="mb-7 w-full rounded-2xl bg-appBlue160 p-4">
        <h1 className="mb-3 mt-5 text-center text-lg font-medium md:text-xl lg:text-2xl">
          Payment Pending
        </h1>
        <p className="mb-1 text-sm font-normal sm:text-base">
          {
            translatedValues?.[
              "We have detected your verification fee and are currently awaiting its confirmation on the network. You may proceed to your home page the verification will be done once the payment has received at least 1 confirmation on the network."
            ]
          }
        </p>

        <h3 className="mb-1 mt-4 text-sm font-bold sm:text-base">
          Transaction ID:{" "}
        </h3>

        <p className="custom-break-words flex-1   text-base font-semibold text-appYellow300">
          {txID}
        </p>

        <div className="flex items-center justify-center pb-5 pt-7">
          <Link
            className=" w-full rounded-2xl bg-transparent py-4 text-center  text-sm font-bold text-white shadow-appButtonInnerShadow2 transition-all duration-300  hover:bg-appBlue800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            to={`https://mempool.space/tx/${txID}`}
            target="_blank"
          >
            {translatedValues?.["VIEW IN BLOCK EXPLORER"]}
          </Link>
        </div>
      </div>
    </>
  );
};

export default BroadcastedPaymentSubPage;
