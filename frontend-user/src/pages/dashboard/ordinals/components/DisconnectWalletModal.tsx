import { disconnectWallet } from "@/api/user.api";
import CheckIcon from "@/assets/icons/CheckIcon";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useGetProfileKey } from "@/hooks/useGetRequests";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import { authStore } from "@/stores/auth.store";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";

const DisconnectWalletModal = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);
  const { closeActiveModal } = useStore(appStateStore);
  const { getUserData } = useStore(authStore);

  const disconnectWalletAPI = useMutation({ mutationFn: disconnectWallet });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDisconnect = async () => {
    if (!isChecked)
      return appToast.Warning(
        "Briefly review the terms below, then click the checkbox to proceed. Thank you!",
      );

    const response = await disconnectWalletAPI.mutateAsync();

    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: [useGetProfileKey] });
      appToast.Success(
        response?.data?.message ?? "Wallet disconnected successfully.",
      );
      closeActiveModal();
      navigate(routes.DASHBOARD_PAGE, { replace: true });
    } else handleApiErrors(response);
  };

  const isLoading = disconnectWalletAPI?.isPending;

  return (
    <div className="mx-auto max-w-[25rem] rounded-3xl bg-appBlue140 px-5 py-10 font-baloo2 text-base font-normal text-white sm:text-lg">
      <h1 className="text-center">
        Are you sure you want to <br />{" "}
        <span className="text-appYellow300">DISCONNECT</span>
        <span className="text-white">?</span>
      </h1>
      <h2 className="my-1 text-left">Wallet Address:</h2>
      <dl className="flex items-center justify-between gap-1">
        <dd className="line-clamp-1 block flex-1 truncate pr-2 text-sm">
          {getUserData()?.ordinalWallet?.address}
        </dd>

        <button className="flex items-center gap-1 rounded-full bg-appBlue150 px-2 py-1 text-sm transition-all duration-300 hover:scale-105 active:scale-95">
          <span>Copy</span>
          <Icon icon="solar:copy-bold" className="text-lg" />
        </button>
      </dl>

      <article className="my-8 flex gap-3">
        <span
          onClick={() => setIsChecked((value) => !value)}
          className="flex aspect-square h-6 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded border-[2px] border-appGray300"
        >
          <CheckIcon isChecked={isChecked} />
        </span>
        <p className="text-sm text-appYellow300">
          By clicking this box, you acknowledge that disconnecting your wallet
          will require entering and verifying a new wallet address to load your
          Ordinals, incurring a new verification fee. You accept responsibility
          for maintaining accurate wallet information. We reserve the right to
          modify these terms at any time.
        </p>
      </article>

      <footer className="flex items-center gap-4">
        <button
          onClick={closeActiveModal}
          type="button"
          disabled={isLoading}
          className="flex-1 rounded-full border border-white p-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-appBlue800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          NO, CANCEL
        </button>
        <button
          disabled={isLoading}
          onClick={handleDisconnect}
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-appRed100 p-3 text-sm font-medium text-appRed100 transition-all duration-300 hover:border-appRed300 hover:bg-appRed300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
        >
          <span>YES, DELETE</span>
          {isLoading && <SpinnerIcon className="animate-spin" />}
        </button>
      </footer>
    </div>
  );
};

export default DisconnectWalletModal;
