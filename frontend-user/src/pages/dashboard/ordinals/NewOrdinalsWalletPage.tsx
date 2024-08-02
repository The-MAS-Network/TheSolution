import { getOrdinalsFromWallet } from "@/api/ordinals.api";
import { generateOnChainWallet } from "@/api/user.api";
import CheckIcon from "@/assets/icons/CheckIcon";
import AppLoader from "@/components/AppLoader";
import AppSearchInput from "@/components/AppSearchInput";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import useDebounce from "@/hooks/useDebouncer";
import { useGetProfileKey } from "@/hooks/useGetRequests";
import routes from "@/navigation/routes";
import { pasteFromClipboard } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import OrdinalCard from "./components/OrdinalCard";
import { useStore } from "zustand";
import { authStore } from "@/stores/auth.store";
import { useVisitIntendedRoute } from "@/utilities/visitIntendedRoute";

const pageValues = [
  "Enter your Ordinals Wallet Address",
  "My Ordinals Wallet",
  "PASTE",
  "CLAIM WALLET",
  "By clicking this box, you agree to paying a one-time fee from your Ordinal Wallet to help verify ownership and support the platform. You acknowledge that the wallet verification may be required again if another user claims ownership of the same wallet address using this method.",
  "Owner of",
  "Inscriptions",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const NewOrdinalsWalletPage = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const debouncedValue = useDebounce(searchValue?.trim(), 500);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const generateOnChainWalletAPI = useMutation({
    mutationFn: generateOnChainWallet,
  });
  const queryClient = useQueryClient();
  const { getUserData, updateProfile } = useStore(authStore);

  useEffect(() => {
    if (debouncedValue.length < 3 && debouncedValue.length > 0)
      appToast.Warning("Search value must be greater than 3 characters");
  }, [debouncedValue]);

  const handlePaste = async () => {
    const clipboardValue = await pasteFromClipboard();
    setSearchValue(clipboardValue);
  };

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["getOrdinalsFromWallet", debouncedValue?.trim()],
    queryFn: async () => {
      const response = await getOrdinalsFromWallet(debouncedValue?.trim());
      if (response.ok) {
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
    enabled: debouncedValue?.length > 2,
  });

  const handleSearchClick = () => {
    if (debouncedValue.length > 3) {
      refetch();
    }
  };

  const isValidWalletAddress = !!data;

  const handleBackClick = () => {
    if (isValidWalletAddress) setSearchValue("");
    else navigate(-1);
  };

  const handleClaim = async () => {
    if (!isChecked)
      return appToast.Warning(
        "Accept the terms and conditions by checking the box below.",
      );

    if (!data) return appToast.Warning("No ordinal data found");
    const regex = /@/;

    if (regex.test(debouncedValue))
      return appToast.Info("This is not a valid Ordinal wallet address.");

    if (data?.results?.length < 1)
      return appToast.Info(
        "You need to have at least 1 Ordinal in your on-chain address before claiming.",
      );

    if (debouncedValue.length < 3 || !data)
      return appToast.Warning("Invalid address");

    const response = await generateOnChainWalletAPI.mutateAsync({
      address: debouncedValue,
    });

    if (response.ok) {
      if (response?.data) updateProfile(response?.data?.data);
      appToast.Success(
        response?.data?.message ?? "Payment wallet created successfully.",
      );
      queryClient.invalidateQueries({ queryKey: [useGetProfileKey] });
      navigate(routes.ORDINALS_PAGE, { replace: true });
    } else {
      handleApiErrors(response);
    }
  };

  const isPageLoading = isRefetching || isLoading;
  const isCreateWalletLoading = generateOnChainWalletAPI?.isPending;

  // SHOULD BE LAST
  const { isEffectDone } = useVisitIntendedRoute({
    condition: !!getUserData()?.ordinalWallet,
    otherParams: {
      customIntendedRoutes: [routes.ORDINALS_PAGE],
      defaultRoute: routes.DASHBOARD_PAGE,
    },
  });

  if (!isEffectDone) {
    return <></>;
  }

  return (
    <main className="app-container-lg h-full min-h-screen flex-col  items-center justify-center font-baloo2 font-medium text-white md:flex">
      <AppLoader isActive={isPageLoading} />
      <section className="mx-auto flex w-full max-w-[26rem] flex-col items-center justify-center  pb-16 text-center text-white md:pb-24 md:pt-32">
        <div className="sticky top-0 z-[1] w-full bg-appBlue100  pt-10  ">
          <div className="pb-3">
            <DashboardHeader
              onClick={handleBackClick}
              title={translatedValues?.["Enter your Ordinals Wallet Address"]}
            />
          </div>
          <AppSearchInput
            onSearchClick={handleSearchClick}
            value={searchValue}
            onChange={(value) => setSearchValue(value?.currentTarget?.value)}
            placeholder="i.e bc1pe2jk922ph9fhuf....."
          />
        </div>

        {isValidWalletAddress ? (
          <>
            <p className="w-full text-left text-sm font-medium sm:text-base">
              {translatedValues?.["Owner of"]}
              {"  "} {data?.total}
              {"  "} {translatedValues.Inscriptions}
            </p>

            <ul className="grid grid-cols-2 gap-x-5 gap-y-8 pb-20 pt-6">
              {data?.results?.map((data, index) => (
                <OrdinalCard
                  key={index}
                  ordinal={{
                    contentType: data?.content_type,
                    id: "",
                    ordinalId: data?.id,
                    mimeType: data?.mime_type,
                    possibleOrdinalContent: data?.value,
                  }}
                />
              ))}
            </ul>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setIsChecked((value) => !value)}
                className="mt-2 flex aspect-square h-6 flex-shrink-0 items-center justify-center overflow-hidden rounded border-[2px] border-appGray300"
              >
                <CheckIcon isChecked={isChecked} />
              </button>

              <p className="text-left text-sm font-semibold text-black sm:text-base">
                {
                  translatedValues?.[
                  "By clicking this box, you agree to paying a one-time fee from your Ordinal Wallet to help verify ownership and support the platform. You acknowledge that the wallet verification may be required again if another user claims ownership of the same wallet address using this method."
                  ]
                }
              </p>
            </div>

            <button
              type="button"
              disabled={isCreateWalletLoading}
              onClick={handleClaim}
              className="app-button-primary-200 mt-7 flex items-center justify-center gap-x-2"
            >
              <span>{translatedValues["CLAIM WALLET"]}</span>
              {isCreateWalletLoading && (
                <SpinnerIcon className="animate-spin" />
              )}
            </button>
          </>
        ) : (
          <>
            {/* <p className="my-14 max-w-[15rem] py-10  text-base font-medium text-white md:text-lg lg:text-xl">
              {translatedValues?.["Enter your Ordinals Wallet Address"]}
            </p> */}

            <button
              type="button"
              onClick={handlePaste}
              className="mx-auto flex items-center justify-center gap-2 rounded-2xl bg-appLight100 px-14 py-4 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {translatedValues?.PASTE}
              <Icon icon="fa-solid:paste" className="text-2xl" />
            </button>
          </>
        )}
      </section>
    </main>
  );
};

export default NewOrdinalsWalletPage;
