import { GenericAPIResponse } from "@/types/api";
import { GetBackendOrdinalsFromWalletAddress } from "@/types/api/ordinals.types";
import baseApi from "./base.api";

export const getOrdinalsFromWallet = (id: string) =>
  baseApi.get<GetBackendOrdinalsFromWalletAddress, GenericAPIResponse>(
    "/ordinals/wallet/" + id,
  );
