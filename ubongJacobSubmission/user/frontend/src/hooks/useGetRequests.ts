import {
  getMaxTrialCount,
  getProfile,
  verifyUserOrdinalTransaction,
} from "@/api/user.api";
import { authStore } from "@/stores/auth.store";
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
  const { updateProfile } = useStore(authStore);

  const response = useQuery({
    queryKey: ["verifyUserOrdinalTransaction"],
    queryFn: async () => {
      const response = await verifyUserOrdinalTransaction();
      if (response.ok) {
        if (response?.data) updateProfile(response?.data?.data);
        return response?.data?.data;
      } else {
        if (
          response?.data?.message?.trim() !==
          "No transaction ID found yet for the given onchain wallet."
        ) {
          handleApiErrors(response);
        }
        return null;
      }
    },
    staleTime: 60000, //number in milliseconds equals to 1 minute,
  });

  return response;
};
