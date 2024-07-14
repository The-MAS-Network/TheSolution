import { handleApiErrors } from "@/utilities/handleErrors";
import OrdinalCard from "../components/OrdinalCard";
import {
  getUserWalletOrdinals,
  getUserWalletOrdinalsKey,
  rescanUserWallet,
} from "@/api/user.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AppBackButton from "@/components/AppBackButton";
import DisconnectWalletModal from "../components/DisconnectWalletModal";
import { useStore } from "zustand";
import { appStateStore } from "@/stores/appState.store";
import AppLoadingAnimation from "@/components/AppLoadingAnimation";
import EmptyDataComponent from "@/components/EmptyDataComponent";
import { appToast } from "@/utilities/appToast";

interface Props {
  disconnectWalletTitle: string;
  errorMessage: string;
  rescanWalletTitle: string;
}

const VerifiedOrdinalWalletSubPage = ({
  disconnectWalletTitle,
  errorMessage,
  rescanWalletTitle,
}: Props): JSX.Element => {
  const rescanWalletAPI = useMutation({ mutationFn: rescanUserWallet });
  const queryClient = useQueryClient();

  const { data, isRefetching, isLoading } = useQuery({
    queryKey: [getUserWalletOrdinalsKey],
    queryFn: async () => {
      const response = await getUserWalletOrdinals();
      if (response.ok) {
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  const isPageLoading = isLoading || isRefetching || rescanWalletAPI?.isPending;
  const { setActiveModal } = useStore(appStateStore);

  const handleDisconnectWallet = () => {
    setActiveModal({
      modalType: "Type two",
      modalChildComponent: <DisconnectWalletModal />,
      shouldBackgroundClose: true,
    });
  };

  const handleRescan = async () => {
    const response = await rescanWalletAPI.mutateAsync();
    if (response?.ok) {
      queryClient.invalidateQueries({ queryKey: [getUserWalletOrdinalsKey] });
      appToast.Success(
        response?.data?.message ?? "Wallet rescanned successfully.",
      );
    } else {
      handleApiErrors(response);
    }
  };

  return (
    <>
      <header>
        <AppBackButton />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-9">
          <button
            type="button"
            onClick={handleDisconnectWallet}
            className="rounded-xl bg-appBlue800 p-3 text-sm transition-all duration-300 hover:bg-appYellow500/90 hover:text-appYellow700 sm:text-base"
          >
            {disconnectWalletTitle}
          </button>
          <button
            type="button"
            onClick={handleRescan}
            className="rounded-xl bg-white p-3 text-sm text-appDarkBlue100 transition-all duration-300 hover:bg-appYellow500/90 hover:text-appYellow700 sm:text-base"
          >
            {rescanWalletTitle}
          </button>
        </div>
      </header>

      {isPageLoading ? (
        <AppLoadingAnimation />
      ) : !data?.length || data?.length < 1 ? (
        <EmptyDataComponent message={errorMessage} />
      ) : (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-8 pb-20 pt-6">
          {data?.map((data, index) => (
            <OrdinalCard key={index} ordinal={data} />
          ))}
        </ul>
      )}
    </>
  );
};

export default VerifiedOrdinalWalletSubPage;
