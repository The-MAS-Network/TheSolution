import {
  getMaxTrialCount,
  getProfile,
  verifyUserOrdinalTransaction,
} from "@/api/user.api";
import { authStore } from "@/stores/auth.store";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";

export const useGetMaxTrialCount = () => {
  const response = useQuery({
    queryKey: ["getMaxTrialCount"],
    queryFn: async () => {
      const response = await getMaxTrialCount();
      if (response.ok) {
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  return response;
};

export const useGetProfileKey = "useGetProfileKey";
export const useGetProfile = () => {
  const { updateProfile } = useStore(authStore);

  const response = useQuery({
    queryKey: [useGetProfileKey],
    queryFn: async () => {
      const response = await getProfile();
      if (response.ok) {
        if (response?.data) updateProfile(response?.data?.data);
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  return response;
};

export const useVerifyUserOrdinalTransaction = () => {
  const { updateOrdinalWalletData } = useStore(authStore);

  const response = useQuery({
    queryKey: ["verifyUserOrdinalTransaction"],
    queryFn: async () => {
      const response = await verifyUserOrdinalTransaction();
      if (response.ok) {
        if (response?.data) updateOrdinalWalletData(response?.data?.data);
        return response?.data?.data;
      } else {
        if (response?.data) updateOrdinalWalletData(response?.data?.data);
        if (
          response?.data?.message?.trim() !==
          "No transaction ID found yet for the given onchain wallet."
        ) {
          if (
            response?.data?.message
              ?.trim()
              .includes("Transaction details confirmation is less than")
          )
            appToast.Warning(response?.data?.message ?? "");
          else handleApiErrors(response);
        }
        return null;
      }
    },
    staleTime: 15000, //number in milliseconds equals to 15 seconds,
    refetchInterval: 15000, //number in milliseconds equals to 15 seconds
  });

  return response;
};
