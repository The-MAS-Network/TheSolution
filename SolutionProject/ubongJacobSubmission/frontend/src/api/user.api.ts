import { GenericAPIResponse } from "@/types/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/api/auth.types";

import baseApi from "./base.api";

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
