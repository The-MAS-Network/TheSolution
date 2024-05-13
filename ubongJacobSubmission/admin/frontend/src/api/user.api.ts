import { GenericAPIResponse } from "@/types/api";
import {
  ChangePasswordReq,
  GenerateOTPRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordReq,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "@/types/api/auth.types";
import baseApi, { backendTokenName, baseApiWithoutToken } from "./base.api";

export const login = (data: LoginRequest) =>
  baseApi.post<LoginResponse, GenericAPIResponse>("/auth/login", data);

export const generateOTP = (data: GenerateOTPRequest) =>
  baseApi.post<GenericAPIResponse, GenericAPIResponse>(
    "/auth/generate-otp",
    data,
  );

export const verifyOTP = (data: VerifyOTPRequest) =>
  baseApi.post<VerifyOTPResponse, GenericAPIResponse>("/auth/verify-otp", data);

export const resetPassword = ({ token, ...data }: ResetPasswordReq) =>
  baseApiWithoutToken.post<GenericAPIResponse, GenericAPIResponse>(
    "/auth/reset-password",
    data,
    {
      headers: {
        [backendTokenName]: token,
      },
    },
  );

export const changePassword = ({ token, ...data }: ChangePasswordReq) =>
  baseApiWithoutToken.post<LoginResponse, GenericAPIResponse>(
    "/auth/change-password",
    data,
    {
      headers: {
        [backendTokenName]: token,
      },
    },
  );

// export const Register = (data: RegisterRequest) =>
//   baseApi.post<RegisterResponse, GenericAPIResponse>("/auth/register", data);

// export const verifyLightningAddress = (data: { lightningAddress: string }) =>
//   baseApi.post<GenericAPIResponse, GenericAPIResponse>(
//     "/auth/verify-lightning-address",
//     data,
//   );

// export const getProfile = () =>
//   baseApi.get<RegisterResponse, GenericAPIResponse>("/auth/profile");

// export const editProfile = (data: { nickName?: string; imageURL?: string }) =>
//   baseApi.patch<RegisterResponse, GenericAPIResponse>("/auth/profile", data);

// export const createInvoice = (data: CreateInvoiceParams) =>
//   baseApi.post<CreateInvoiceRes, GenericAPIResponse>("/payment", data);

// export const verifyInvoice = (data: VerifyInvoiceParams) =>
//   baseApi.patch<VerifyInvoiceRes, GenericAPIResponse>("/payment", data);

// export const getMaxTrialCount = () =>
//   baseApi.get<GetMaxTrialRes, GenericAPIResponse>("/auth/get-max-trial-count");

// export const verifyDualAmount = (data: VerifyDualAmountParams) =>
//   baseApi.patch<VerifyDualAmountRes, VerifyDualAmountError>(
//     "/auth/verify-dual-amounts",
//     data,
//   );

// export const changePassword = (data: ChangePasswordParams) =>
//   baseApi.patch<GenericAPIResponse, GenericAPIResponse>(
//     "/auth/change-password",
//     {
//       password: data?.password,
//     },
//     {
//       headers: {
//         [backendTokenName]: data?.token,
//       },
//     },
//   );
