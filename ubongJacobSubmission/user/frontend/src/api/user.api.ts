import { GenericAPIResponse } from "@/types/api";
import {
  ChangePasswordParams,
  CreateInvoiceParams,
  CreateInvoiceRes,
  GetMaxTrialRes,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyDualAmountError,
  VerifyDualAmountParams,
  VerifyDualAmountRes,
  VerifyInvoiceParams,
  VerifyInvoiceRes,
} from "../types/api/auth.types";

import { GetUserWalletOrdinalsRes } from "@/types/api/ordinals.types";
import baseApi, { backendTokenName } from "./base.api";

export const login = (data: LoginRequest) =>
  baseApi.post<LoginResponse, GenericAPIResponse>("/auth/login", data);

export const Register = (data: RegisterRequest) =>
  baseApi.post<RegisterResponse, GenericAPIResponse>("/auth/register", data);

export const verifyLightningAddress = (data: { lightningAddress: string }) =>
  baseApi.post<GenericAPIResponse, GenericAPIResponse>(
    "/auth/verify-lightning-address",
    data,
  );

export const getProfile = () =>
  baseApi.get<RegisterResponse, GenericAPIResponse>("/auth/profile");

export const editProfile = (data: { nickName?: string; imageURL?: string }) =>
  baseApi.patch<RegisterResponse, GenericAPIResponse>("/auth/profile", data);

export const createInvoice = (data: CreateInvoiceParams) =>
  baseApi.post<CreateInvoiceRes, GenericAPIResponse>("/payment", data);

export const verifyInvoice = (data: VerifyInvoiceParams) =>
  baseApi.patch<VerifyInvoiceRes, GenericAPIResponse>("/payment", data);

export const getMaxTrialCount = () =>
  baseApi.get<GetMaxTrialRes, GenericAPIResponse>("/auth/get-max-trial-count");

export const verifyDualAmount = (data: VerifyDualAmountParams) =>
  baseApi.patch<VerifyDualAmountRes, VerifyDualAmountError>(
    "/auth/verify-dual-amounts",
    data,
  );

export const changePassword = (data: ChangePasswordParams) =>
  baseApi.patch<GenericAPIResponse, GenericAPIResponse>(
    "/auth/change-password",
    {
      password: data?.password,
    },
    {
      headers: {
        [backendTokenName]: data?.token,
      },
    },
  );

export const getUserWalletOrdinalsKey = "getUserWalletOrdinalsKey";
export const getUserWalletOrdinals = () =>
  baseApi.get<GetUserWalletOrdinalsRes, GenericAPIResponse>(
    "/auth/profile/ordinals",
  );

export const generateOnChainWallet = ({ address }: { address: string }) =>
  baseApi.post<RegisterResponse, GenericAPIResponse>("/payment/onchain", {
    walletAddress: address,
  });

export const disconnectWallet = () =>
  baseApi.patch<GenericAPIResponse>("/auth/disconnect-wallet");

export const verifyUserOrdinalTransaction = () =>
  baseApi.get<RegisterResponse, GenericAPIResponse>(
    "/auth/verify-ordinal-transaction",
  );
