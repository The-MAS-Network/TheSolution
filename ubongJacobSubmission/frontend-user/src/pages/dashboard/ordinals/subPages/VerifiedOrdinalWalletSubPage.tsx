import { handleApiErrors } from "@/utilities/handleErrors";
import OrdinalCard from "../components/OrdinalCard";
import {
  getUserWalletOrdinals,
  getUserWalletOrdinalsKey,
} from "@/api/user.api";
import { useQuery } from "@tanstack/react-query";
import AppBackButton from "@/components/AppBackButton";
import DisconnectWalletModal from "../components/DisconnectWalletModal";
import { useStore } from "zustand";
import { appStateStore } from "@/stores/appState.store";
import AppLoadingAnimation from "@/components/AppLoadingAnimation";
import EmptyDataComponent from "@/components/EmptyDataComponent";

interface Props {
  disconnectWalletTitle: string;
  errorMessage: string;
}

const VerifiedOrdinalWalletSubPage = ({
  disconnectWalletTitle,
  errorMessage,
}: Props): JSX.Element => {
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

  const isPageLoading = isLoading || isRefetching;
  const { setActiveModal } = useStore(appStateStore);

  const handleDisconnectWallet = () => {
    setActiveModal({
      modalType: "Type two",
      modalChildComponent: <DisconnectWalletModal />,
      shouldBackgroundClose: true,
    });
  };

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-9">
        <AppBackButton />

        <button
          type="button"
          onClick={handleDisconnectWallet}
          className="rounded-xl bg-appBlue800 p-3 text-sm transition-all duration-300 hover:bg-appYellow500/90 hover:text-appYellow700 sm:text-base"
        >
          {disconnectWalletTitle}
        </button>
      </header>

      {isPageLoading ? (
        <AppLoadingAnimation />
      ) : !data?.results?.length || data?.results?.length < 1 ? (
        <EmptyDataComponent message={errorMessage} />
      ) : (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-8 pb-20 pt-6">
          {data?.results?.map((data, index) => (
            <OrdinalCard key={index} ordinal={data} />
          ))}
        </ul>
      )}
    </>
  );
};

export default VerifiedOrdinalWalletSubPage;
