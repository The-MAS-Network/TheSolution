import { GetUserWalletOrdinalsRes } from "@/types/api/ordinals.types";
import baseApi from "./base.api";
import { GenericAPIResponse } from "@/types/api";

export const getOrdinalsFromWallet = (id: string) =>
  baseApi.get<GetUserWalletOrdinalsRes, GenericAPIResponse>(
    "/ordinals/wallet/" + id,
  );
